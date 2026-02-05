export function convertToSerializableObject<T extends Record<string, any>>(
  leanDocument: T,
): T {
  for (const key in leanDocument) {
    const value = leanDocument[key];

    if (
      value &&
      typeof value === 'object' &&
      'toJSON' in value &&
      'toString' in value
    ) {
      (leanDocument as Record<string, any>)[key] = value.toString();
    }
  }

  return leanDocument;
}
