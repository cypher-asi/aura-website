import { NextResponse } from 'next/server';

import { getDownloadPath } from '@/config/downloadTargets';
import {
  detectDownloadTargetFromRequest,
  getDirectDownloadRedirectUrl,
  getDownloadEnvKeys,
  getFallbackDownloadUrl,
} from '@/server/downloadUrls';

export function GET(request: Request): Response {
  const target = detectDownloadTargetFromRequest(request);

  if (target === 'mac') {
    return NextResponse.redirect(new URL(getDownloadPath('mac'), request.url));
  }

  const destination = target ? getDirectDownloadRedirectUrl(target) : getFallbackDownloadUrl();

  if (!destination) {
    return NextResponse.json(
      {
        error: 'Download URL is not configured.',
        expectedEnv: getDownloadEnvKeys(target),
      },
      { status: 503 },
    );
  }

  return NextResponse.redirect(new URL(destination, request.url));
}
