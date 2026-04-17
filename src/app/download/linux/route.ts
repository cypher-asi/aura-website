import { NextResponse } from 'next/server';

import { getDownloadPath } from '@/config/downloadTargets';
import { getDirectDownloadRedirectUrl } from '@/server/downloadUrls';
import { resolveRedirectUrl } from '@/server/redirectUrl';

export async function GET(request: Request): Promise<Response> {
  const destination = await getDirectDownloadRedirectUrl('linux');

  if (!destination) {
    return NextResponse.redirect(resolveRedirectUrl(request, getDownloadPath()));
  }

  return NextResponse.redirect(resolveRedirectUrl(request, destination));
}
