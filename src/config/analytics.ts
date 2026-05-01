function readSiteId(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

export const FATHOM_SITE_ID = readSiteId(process.env.NEXT_PUBLIC_FATHOM_SITE_ID);
