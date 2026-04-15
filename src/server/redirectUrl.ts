function getFirstForwardedValue(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const first = value
    .split(',')
    .map((part) => part.trim())
    .find(Boolean);

  return first || undefined;
}

export function getPublicRequestOrigin(request: Request): string {
  const fallbackOrigin = new URL(request.url).origin;
  const forwardedHost = getFirstForwardedValue(request.headers.get('x-forwarded-host'));
  const forwardedProto = getFirstForwardedValue(request.headers.get('x-forwarded-proto'));
  const host = getFirstForwardedValue(request.headers.get('host'));
  const resolvedHost = forwardedHost || host;

  if (!resolvedHost) {
    return fallbackOrigin;
  }

  const protocol = forwardedProto || new URL(fallbackOrigin).protocol.replace(/:$/, '');
  return `${protocol}://${resolvedHost}`;
}

export function resolveRedirectUrl(request: Request, destination: string): URL {
  if (/^https?:\/\//i.test(destination)) {
    return new URL(destination);
  }

  return new URL(destination, getPublicRequestOrigin(request));
}
