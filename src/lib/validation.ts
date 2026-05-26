export type ValidationResult = {
  valid: boolean;
  message?: string;
};

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const isValidEmail = (value: unknown): value is string => {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export const isWithinLength = (
  value: unknown,
  minLength: number,
  maxLength: number,
): value is string => {
  if (!isNonEmptyString(value)) {
    return false;
  }

  const length = value.trim().length;

  return length >= minLength && length <= maxLength;
};

export const sanitizePlainText = (value: string) =>
  value.replace(/[<>]/g, "").trim();

export const validateContactName = (value: unknown): ValidationResult => {
  if (!isWithinLength(value, 2, 80)) {
    return {
      valid: false,
      message: "Il nome deve contenere tra 2 e 80 caratteri.",
    };
  }

  return { valid: true };
};

export const validateContactEmail = (value: unknown): ValidationResult => {
  if (!isValidEmail(value)) {
    return {
      valid: false,
      message: "Inserisci un indirizzo email valido.",
    };
  }

  return { valid: true };
};

export const validateContactMessage = (value: unknown): ValidationResult => {
  if (!isWithinLength(value, 10, 1500)) {
    return {
      valid: false,
      message: "Il messaggio deve contenere tra 10 e 1500 caratteri.",
    };
  }

  return { valid: true };
};
