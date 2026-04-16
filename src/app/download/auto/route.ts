import { NextResponse } from 'next/server';

import { getDownloadPath, normalizeDownloadTarget } from '@/config/downloadTargets';
import {
  detectDownloadTargetFromRequest,
  getDirectDownloadRedirectUrl,
  getFallbackDownloadUrlResolved,
} from '@/server/downloadUrls';
import { resolveRedirectUrl } from '@/server/redirectUrl';

export async function GET(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  const explicitTarget = normalizeDownloadTarget(requestUrl.searchParams.get('target'));
  const detectedTarget = explicitTarget ?? detectDownloadTargetFromRequest(request);
  const downloadPagePath = detectedTarget === 'mac' ? getDownloadPath('mac') : getDownloadPath();

  if (detectedTarget === 'mac') {
    return NextResponse.redirect(resolveRedirectUrl(request, getDownloadPath('mac')));
  }

  const destination = detectedTarget
    ? await getDirectDownloadRedirectUrl(detectedTarget)
    : await getFallbackDownloadUrlResolved();

  if (!destination) {
    return NextResponse.redirect(resolveRedirectUrl(request, downloadPagePath));
  }

  return NextResponse.redirect(resolveRedirectUrl(request, destination));
}
