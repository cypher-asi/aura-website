import { NextResponse } from 'next/server';

import { getDownloadPath } from '@/config/downloadTargets';
import {
  detectDownloadTargetFromRequest,
  getDirectDownloadRedirectUrl,
  getDownloadEnvKeys,
  getFallbackDownloadUrlResolved,
} from '@/server/downloadUrls';

export async function GET(request: Request): Promise<Response> {
  const target = detectDownloadTargetFromRequest(request);

  if (target === 'mac') {
    return NextResponse.redirect(new URL(getDownloadPath('mac'), request.url));
  }

  const destination = target ? await getDirectDownloadRedirectUrl(target) : await getFallbackDownloadUrlResolved();

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
