const ENABLED_FLAG_VALUES = new Set(['1', 'true', 'yes', 'on']);

function parsePublicFlag(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  return ENABLED_FLAG_VALUES.has(value.toLowerCase());
}

export const ENABLE_TOP_NAV = parsePublicFlag(process.env.NEXT_PUBLIC_ENABLE_TOP_NAV);
export const ENABLE_MAIN_IMAGE = parsePublicFlag(process.env.NEXT_PUBLIC_ENABLE_MAIN_IMAGE, false);
