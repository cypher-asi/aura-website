import { NextResponse } from 'next/server';

import { getDownloadPath, normalizeMacDownloadVariant } from '@/config/downloadTargets';
import { getMacDownloadRedirectUrl } from '@/server/downloadUrls';
import { resolveRedirectUrl } from '@/server/redirectUrl';

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

  const destination = await getMacDownloadRedirectUrl(normalizedVariant);

  if (!destination) {
    return NextResponse.redirect(resolveRedirectUrl(request, getDownloadPath('mac')));
  }

  return NextResponse.redirect(resolveRedirectUrl(request, destination));
}
