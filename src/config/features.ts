const ENABLED_FLAG_VALUES = new Set(['1', 'true', 'yes', 'on']);

function parsePublicFlag(value: string | undefined): boolean {
  return value !== undefined && ENABLED_FLAG_VALUES.has(value.toLowerCase());
}

export const ENABLE_TOP_NAV = parsePublicFlag(process.env.NEXT_PUBLIC_ENABLE_TOP_NAV);
