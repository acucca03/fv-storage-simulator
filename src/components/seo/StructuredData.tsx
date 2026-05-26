type StructuredDataProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

const serializeStructuredData = (data: StructuredDataProps["data"]) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeStructuredData(data),
      }}
    />
  );
}
