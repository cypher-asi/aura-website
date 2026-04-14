import { NextResponse } from 'next/server';

import { getDirectDownloadRedirectUrl } from '@/server/downloadUrls';

export async function GET(request: Request): Promise<Response> {
  const destination = await getDirectDownloadRedirectUrl('windows');

  if (!destination) {
    return NextResponse.json(
      {
        error: 'Download URL is not configured.',
        expectedEnv: ['DOWNLOAD_WINDOWS_URL', 'DOWNLOAD_FALLBACK_URL'],
      },
      { status: 503 },
    );
  }

  return NextResponse.redirect(new URL(destination, request.url));
}
