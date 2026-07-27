export function validateTopLevelSchemaContract(instance, schema, label) {
  const errors = [];

  if (!instance || typeof instance !== 'object' || Array.isArray(instance)) {
    return [`${label}: must be an object`];
  }

  const properties = schema?.properties;
  if (!properties || typeof properties !== 'object' || Array.isArray(properties)) {
    return [`${label}: schema must declare top-level properties`];
  }

  for (const field of schema.required ?? []) {
    if (!Object.hasOwn(instance, field)) {
      errors.push(`${label}: missing required field '${field}' according to its schema`);
    }
  }

  if (schema.additionalProperties === false) {
    const allowedFields = new Set(Object.keys(properties));
    for (const field of Object.keys(instance)) {
      if (!allowedFields.has(field)) {
        errors.push(`${label}: unsupported field '${field}' according to its schema`);
      }
    }
  }

  return errors;
}
