import { NextResponse } from 'next/server';

import { normalizeMacDownloadVariant } from '@/config/downloadTargets';
import { getMacDownloadEnvKeys, getMacDownloadRedirectUrl } from '@/server/downloadUrls';

interface MacDownloadVariantRouteContext {
  readonly params: Promise<{
    readonly variant: string;
  }>;
}

export async function GET(request: Request, context: MacDownloadVariantRouteContext): Promise<Response> {
  const { variant } = await context.params;
  const normalizedVariant = normalizeMacDownloadVariant(variant);

  if (!normalizedVariant) {
    return NextResponse.json(
      {
        error: 'Unknown Mac download target.',
        requestedVariant: variant,
        expectedVariants: ['apple-silicon', 'intel'],
      },
      { status: 404 },
    );
  }

  const destination = getMacDownloadRedirectUrl(normalizedVariant);

  if (!destination) {
    return NextResponse.json(
      {
        error: 'Download URL is not configured.',
        requestedVariant: normalizedVariant,
        expectedEnv: getMacDownloadEnvKeys(normalizedVariant),
      },
      { status: 503 },
    );
  }

  return NextResponse.redirect(new URL(destination, request.url));
}
