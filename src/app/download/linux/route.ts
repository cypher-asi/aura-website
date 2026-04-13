import { NextResponse } from 'next/server';

import { getDirectDownloadRedirectUrl } from '@/server/downloadUrls';

export function GET(request: Request): Response {
  const destination = getDirectDownloadRedirectUrl('linux');

  if (!destination) {
    return NextResponse.json(
      {
        error: 'Download URL is not configured.',
        expectedEnv: ['DOWNLOAD_LINUX_URL', 'DOWNLOAD_FALLBACK_URL'],
      },
      { status: 503 },
    );
  }

  return NextResponse.redirect(new URL(destination, request.url));
}
