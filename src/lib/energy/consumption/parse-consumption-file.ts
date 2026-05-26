import type { UploadedConsumptionPoint } from "@/types/energy";

export type ParsedConsumptionFileSummary = {
  fileName: string;
  rows: number;
  annualConsumptionKwh: number;
  firstTimestamp: string;
  lastTimestamp: string;
  resolutionMinutes: number;
  detectedColumn: string;
  selectedYear?: number;
  realDays?: number;
  reconstructedDays?: number;
  duplicateRowsRemoved?: number;
  selectedPeriodLabel?: string;
};

export type ParsedConsumptionFile = {
  profile: UploadedConsumptionPoint[];
  summary: ParsedConsumptionFileSummary;
};

type RawParsedRow = {
  timestamp: string;
  value: number;
};

type QuarterColumn = {
  index: number;
  slot: number;
  header: string;
};

type DayProfile = {
  dateKey: string;
  date: Date;
  values: number[];
  validSlots: number;
  totalKwh: number;
  receivedAtMs: number;
  flowPriority: number;
};

const MAX_UPLOAD_ROWS = 90000;
const QUARTER_HOUR_MINUTES = 15;
const QUARTER_SLOTS_PER_DAY = 96;
const MIN_VALID_SLOTS_PER_DAY = 24;
const MIN_DAYS_FOR_YEAR_SELECTION = 120;
const IDEAL_YEAR_DAYS = 365;

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "");
}

function parseNumber(value: string) {
  const cleaned = value.trim().replace(/\s/g, "").replace(/[^\d,.-]/g, "");

  if (!cleaned) return Number.NaN;

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");

  if (lastComma >= 0 && lastDot >= 0) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    return Number(
      cleaned
        .replaceAll(thousandsSeparator, "")
        .replace(decimalSeparator, "."),
    );
  }

  if (lastComma >= 0) return Number(cleaned.replace(",", "."));

  return Number(cleaned);
}

function parseDelimitedLine(line: string, delimiter: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function detectDelimiter(sampleLine: string) {
  const candidates = [";", ",", "\t"];
  const scored = candidates.map((delimiter) => ({
    delimiter,
    count: parseDelimitedLine(sampleLine, delimiter).length,
  }));

  return scored.sort((a, b) => b.count - a.count)[0]?.delimiter ?? ";";
}

function findColumnIndex(headers: string[], candidates: string[]) {
  return headers.findIndex((header) =>
    candidates.some((candidate) => header.includes(candidate)),
  );
}

function findQuarterColumns(headers: string[], rawHeaders: string[]) {
  return headers
    .map((header, index): QuarterColumn | null => {
      const match = header.match(/^ea(\d{1,3})$/);
      if (!match) return null;

      const slot = Number(match[1]);

      if (!Number.isInteger(slot) || slot < 1 || slot > QUARTER_SLOTS_PER_DAY) {
        return null;
      }

      return {
        index,
        slot,
        header: rawHeaders[index] ?? `ea${slot}`,
      };
    })
    .filter((column): column is QuarterColumn => column !== null)
    .sort((a, b) => a.slot - b.slot);
}

function parseDateTime(rawValue: string) {
  const value = rawValue.trim();

  if (!value) return null;

  const direct = new Date(value);
  if (Number.isFinite(direct.getTime()) && /^\d{4}/.test(value)) {
    return direct.toISOString();
  }

  const european = value.match(
    /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})(?:[ T]+(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?)?/,
  );

  if (european) {
    const [, dayRaw, monthRaw, yearRaw, hourRaw, minuteRaw, secondRaw] = european;
    const year = Number(yearRaw.length === 2 ? `20${yearRaw}` : yearRaw);
    const month = Number(monthRaw) - 1;
    const day = Number(dayRaw);
    const hour = Number(hourRaw ?? 0);
    const minute = Number(minuteRaw ?? 0);
    const second = Number(secondRaw ?? 0);
    const date = new Date(Date.UTC(year, month, day, hour, minute, second));

    return Number.isFinite(date.getTime()) ? date.toISOString() : null;
  }

  const isoLike = value.match(
    /^(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})(?:[ T]+(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?)?/,
  );

  if (isoLike) {
    const [, yearRaw, monthRaw, dayRaw, hourRaw, minuteRaw, secondRaw] = isoLike;
    const date = new Date(
      Date.UTC(
        Number(yearRaw),
        Number(monthRaw) - 1,
        Number(dayRaw),
        Number(hourRaw ?? 0),
        Number(minuteRaw ?? 0),
        Number(secondRaw ?? 0),
      ),
    );

    return Number.isFinite(date.getTime()) ? date.toISOString() : null;
  }

  return null;
}

function dateKeyFromDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateKeyFromIso(timestamp: string) {
  return timestamp.slice(0, 10);
}

function addUtcDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60_000);
}

function getDaysInYear(year: number) {
  const start = new Date(Date.UTC(year, 0, 1));
  const next = new Date(Date.UTC(year + 1, 0, 1));

  return Math.round((next.getTime() - start.getTime()) / (24 * 60 * 60_000));
}

function getSeason(month: number) {
  if (month === 11 || month <= 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  return "autumn";
}

function inferResolutionMinutes(rows: RawParsedRow[]) {
  const sortedTimes = rows
    .map((row) => new Date(row.timestamp).getTime())
    .filter(Number.isFinite)
    .sort((a, b) => a - b);

  const deltas = sortedTimes
    .slice(1)
    .map((time, index) => (time - sortedTimes[index]) / 60_000)
    .filter((delta) => delta > 0 && delta <= 1440)
    .sort((a, b) => a - b);

  if (!deltas.length) return 60;

  return Math.max(1, Math.round(deltas[Math.floor(deltas.length / 2)]));
}

function buildTimestamp(row: string[], timestampIndex: number, dateIndex: number, timeIndex: number) {
  if (timestampIndex >= 0) return parseDateTime(row[timestampIndex] ?? "");

  if (dateIndex >= 0) {
    const datePart = row[dateIndex] ?? "";
    const timePart = timeIndex >= 0 ? row[timeIndex] ?? "" : "";
    return parseDateTime(`${datePart} ${timePart}`.trim());
  }

  return null;
}

function createSummary(params: {
  file: File;
  profile: UploadedConsumptionPoint[];
  resolutionMinutes: number;
  detectedColumn: string;
  selectedYear?: number;
  realDays?: number;
  reconstructedDays?: number;
  duplicateRowsRemoved?: number;
  selectedPeriodLabel?: string;
}): ParsedConsumptionFile {
  const annualConsumptionKwh = params.profile.reduce(
    (total, point) => total + point.consumptionKwh,
    0,
  );

  return {
    profile: params.profile,
    summary: {
      fileName: params.file.name,
      rows: params.profile.length,
      annualConsumptionKwh,
      firstTimestamp: params.profile[0].timestamp,
      lastTimestamp: params.profile[params.profile.length - 1].timestamp,
      resolutionMinutes: params.resolutionMinutes,
      detectedColumn: params.detectedColumn,
      selectedYear: params.selectedYear,
      realDays: params.realDays,
      reconstructedDays: params.reconstructedDays,
      duplicateRowsRemoved: params.duplicateRowsRemoved,
      selectedPeriodLabel: params.selectedPeriodLabel,
    },
  };
}

function getFlowPriority(value: string) {
  const normalized = normalizeHeader(value);

  if (normalized.includes("rettifica")) return 3;
  if (normalized.includes("periodica")) return 2;
  return 1;
}

function shouldReplaceDayProfile(current: DayProfile, candidate: DayProfile) {
  if (candidate.validSlots !== current.validSlots) {
    return candidate.validSlots > current.validSlots;
  }

  if (candidate.flowPriority !== current.flowPriority) {
    return candidate.flowPriority > current.flowPriority;
  }

  if (candidate.receivedAtMs !== current.receivedAtMs) {
    return candidate.receivedAtMs > current.receivedAtMs;
  }

  return candidate.totalKwh > current.totalKwh;
}

function chooseBestYear(dayProfiles: DayProfile[]) {
  const byYear = new Map<number, DayProfile[]>();

  for (const profile of dayProfiles) {
    const year = profile.date.getUTCFullYear();
    byYear.set(year, [...(byYear.get(year) ?? []), profile]);
  }

  const ranked = [...byYear.entries()]
    .map(([year, profiles]) => {
      const realDays = profiles.length;
      const expectedDays = getDaysInYear(year);
      const completeness = realDays / expectedDays;
      const completenessBonus = realDays >= MIN_DAYS_FOR_YEAR_SELECTION ? 1000 : 0;

      return {
        year,
        profiles,
        realDays,
        score: completenessBonus + realDays * 10 + completeness - Math.abs(expectedDays - realDays),
      };
    })
    .sort((a, b) => b.score - a.score || b.year - a.year);

  const best = ranked[0];

  if (!best) {
    throw new Error("Non trovo un anno utilizzabile nel file ARERA.");
  }

  if (best.realDays < MIN_DAYS_FOR_YEAR_SELECTION) {
    throw new Error("Il file ARERA contiene troppo pochi giorni validi per ricostruire un anno affidabile.");
  }

  return best;
}

function averageProfiles(candidates: DayProfile[]) {
  if (!candidates.length) return Array.from({ length: QUARTER_SLOTS_PER_DAY }, () => 0);

  return Array.from({ length: QUARTER_SLOTS_PER_DAY }, (_, slotIndex) => {
    const values = candidates
      .map((candidate) => candidate.values[slotIndex])
      .filter((value) => Number.isFinite(value) && value >= 0);

    if (!values.length) return 0;

    return values.reduce((sum, value) => sum + value, 0) / values.length;
  });
}

function findSimilarProfiles(targetDate: Date, realProfiles: DayProfile[]) {
  const targetMonth = targetDate.getUTCMonth();
  const targetDay = targetDate.getUTCDay();
  const targetSeason = getSeason(targetMonth);

  const sameMonthSameDay = realProfiles.filter(
    (profile) =>
      profile.date.getUTCMonth() === targetMonth &&
      profile.date.getUTCDay() === targetDay,
  );

  if (sameMonthSameDay.length >= 2) return sameMonthSameDay;

  const sameMonth = realProfiles.filter(
    (profile) => profile.date.getUTCMonth() === targetMonth,
  );

  if (sameMonth.length >= 2) return sameMonth;

  const sameSeasonSameDay = realProfiles.filter(
    (profile) =>
      getSeason(profile.date.getUTCMonth()) === targetSeason &&
      profile.date.getUTCDay() === targetDay,
  );

  if (sameSeasonSameDay.length >= 2) return sameSeasonSameDay;

  const sameDay = realProfiles.filter(
    (profile) => profile.date.getUTCDay() === targetDay,
  );

  if (sameDay.length >= 2) return sameDay;

  return realProfiles;
}

function buildCompleteYearProfile(params: {
  file: File;
  selectedYear: number;
  realProfiles: DayProfile[];
  duplicateRowsRemoved: number;
}) {
  const byDate = new Map(params.realProfiles.map((profile) => [profile.dateKey, profile]));
  const expectedDays = Math.min(getDaysInYear(params.selectedYear), IDEAL_YEAR_DAYS);
  const start = new Date(Date.UTC(params.selectedYear, 0, 1));
  const profile: UploadedConsumptionPoint[] = [];
  let reconstructedDays = 0;

  for (let dayIndex = 0; dayIndex < expectedDays; dayIndex += 1) {
    const date = addUtcDays(start, dayIndex);
    const key = dateKeyFromDate(date);
    const realProfile = byDate.get(key);
    const values = realProfile
      ? realProfile.values
      : averageProfiles(findSimilarProfiles(date, params.realProfiles));

    if (!realProfile) reconstructedDays += 1;

    const dayStart = date.getTime();

    values.forEach((consumptionKwh, slotIndex) => {
      profile.push({
        timestamp: new Date(
          dayStart + slotIndex * QUARTER_HOUR_MINUTES * 60_000,
        ).toISOString(),
        consumptionKwh,
        originalResolutionMinutes: QUARTER_HOUR_MINUTES,
      });
    });
  }

  return createSummary({
    file: params.file,
    profile,
    resolutionMinutes: QUARTER_HOUR_MINUTES,
    detectedColumn: "ARERA ea1...ea96",
    selectedYear: params.selectedYear,
    realDays: params.realProfiles.length,
    reconstructedDays,
    duplicateRowsRemoved: params.duplicateRowsRemoved,
    selectedPeriodLabel: `${params.selectedYear} · ${params.realProfiles.length} giorni reali + ${reconstructedDays} ricostruiti`,
  });
}

function parseWideQuarterHourFile(params: {
  file: File;
  lines: string[];
  delimiter: string;
  rawHeaders: string[];
  headers: string[];
}) {
  const dateIndex = findColumnIndex(params.headers, [
    "datalettura",
    "data",
    "date",
    "giorno",
  ]);

  const receivedAtIndex = findColumnIndex(params.headers, ["dataricezione"]);
  const flowIndex = findColumnIndex(params.headers, ["tipoflusso"]);
  const quarterColumns = findQuarterColumns(params.headers, params.rawHeaders);

  if (dateIndex < 0 || quarterColumns.length < 24) return null;

  const bestByDate = new Map<string, DayProfile>();
  let rawValidRows = 0;

  for (const line of params.lines.slice(1, MAX_UPLOAD_ROWS + 1)) {
    const row = parseDelimitedLine(line, params.delimiter);
    const dayTimestamp = parseDateTime(row[dateIndex] ?? "");

    if (!dayTimestamp) continue;

    const values = quarterColumns.map((column) => {
      const value = parseNumber(row[column.index] ?? "");
      return Number.isFinite(value) && value >= 0 ? value : 0;
    });

    const validSlots = quarterColumns.filter((column) => {
      const value = parseNumber(row[column.index] ?? "");
      return Number.isFinite(value) && value >= 0;
    }).length;

    if (validSlots < MIN_VALID_SLOTS_PER_DAY) continue;

    rawValidRows += 1;

    const date = new Date(dayTimestamp);
    const dateKey = dateKeyFromDate(date);
    const receivedAtRaw =
      receivedAtIndex >= 0 ? parseDateTime(row[receivedAtIndex] ?? "") : null;
    const receivedAtMs = receivedAtRaw ? new Date(receivedAtRaw).getTime() : 0;
    const flowPriority = flowIndex >= 0 ? getFlowPriority(row[flowIndex] ?? "") : 1;
    const totalKwh = values.reduce((sum, value) => sum + value, 0);

    const candidate: DayProfile = {
      dateKey,
      date,
      values,
      validSlots,
      totalKwh,
      receivedAtMs,
      flowPriority,
    };

    const current = bestByDate.get(dateKey);

    if (!current || shouldReplaceDayProfile(current, candidate)) {
      bestByDate.set(dateKey, candidate);
    }
  }

  const deduplicatedProfiles = [...bestByDate.values()].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  if (deduplicatedProfiles.length < 2) {
    throw new Error("Il file con colonne ea1...ea96 non contiene abbastanza dati validi.");
  }

  const selected = chooseBestYear(deduplicatedProfiles);
  const duplicateRowsRemoved = Math.max(0, rawValidRows - deduplicatedProfiles.length);

  return buildCompleteYearProfile({
    file: params.file,
    selectedYear: selected.year,
    realProfiles: selected.profiles.sort((a, b) => a.date.getTime() - b.date.getTime()),
    duplicateRowsRemoved,
  });
}

function parseSimpleTimeSeriesFile(params: {
  file: File;
  lines: string[];
  delimiter: string;
  rawHeaders: string[];
  headers: string[];
}) {
  const timestampIndex = findColumnIndex(params.headers, [
    "timestamp",
    "datetime",
    "dataora",
    "dataeora",
    "datehour",
    "dateandtime",
  ]);

  const dateIndex = findColumnIndex(params.headers, ["data", "date", "giorno"]);
  const timeIndex = findColumnIndex(params.headers, ["ora", "time", "hour"]);

  const energyIndex = findColumnIndex(params.headers, [
    "kwh",
    "energia",
    "consumo",
    "prelievo",
    "energy",
    "consumption",
  ]);

  const powerIndex = params.headers.findIndex(
    (header) =>
      (header.includes("kw") ||
        header.includes("potenza") ||
        header.includes("power")) &&
      !header.includes("kwh"),
  );

  if (timestampIndex < 0 && dateIndex < 0) {
    throw new Error("Non trovo una colonna data/ora. Usa una colonna timestamp oppure data + ora.");
  }

  if (energyIndex < 0 && powerIndex < 0) {
    throw new Error("Non trovo una colonna consumi. Usa kWh/energia/consumo oppure kW/potenza.");
  }

  const valueIndex = energyIndex >= 0 ? energyIndex : powerIndex;
  const detectedColumn = params.rawHeaders[valueIndex] ?? "consumo";
  const rawRows: RawParsedRow[] = [];

  for (const line of params.lines.slice(1, MAX_UPLOAD_ROWS + 1)) {
    const row = parseDelimitedLine(line, params.delimiter);
    const timestamp = buildTimestamp(row, timestampIndex, dateIndex, timeIndex);
    const value = parseNumber(row[valueIndex] ?? "");

    if (!timestamp || !Number.isFinite(value) || value < 0) continue;

    rawRows.push({
      timestamp,
      value,
    });
  }

  if (rawRows.length < 2) {
    throw new Error("Il file non contiene abbastanza righe valide per ricostruire il profilo consumi.");
  }

  const resolutionMinutes = inferResolutionMinutes(rawRows);
  const sortedRows = rawRows.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const profile = sortedRows.map((row) => ({
    timestamp: row.timestamp,
    consumptionKwh:
      energyIndex >= 0 ? row.value : row.value * (resolutionMinutes / 60),
    originalResolutionMinutes: resolutionMinutes,
  }));

  return createSummary({
    file: params.file,
    profile,
    resolutionMinutes,
    detectedColumn,
    selectedPeriodLabel: `${dateKeyFromIso(profile[0].timestamp)} → ${dateKeyFromIso(profile[profile.length - 1].timestamp)}`,
  });
}

export async function parseConsumptionFile(file: File): Promise<ParsedConsumptionFile> {
  const text = await file.text();
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("Il file deve contenere almeno una riga di intestazione e una riga dati.");
  }

  const delimiter = detectDelimiter(lines[0]);
  const rawHeaders = parseDelimitedLine(lines[0], delimiter);
  const headers = rawHeaders.map(normalizeHeader);

  const wideQuarterHourResult = parseWideQuarterHourFile({
    file,
    lines,
    delimiter,
    rawHeaders,
    headers,
  });

  if (wideQuarterHourResult) return wideQuarterHourResult;

  return parseSimpleTimeSeriesFile({
    file,
    lines,
    delimiter,
    rawHeaders,
    headers,
  });
}
