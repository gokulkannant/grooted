type JwtPayload = {
  exp?: number;
  sub?: string;
};

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as JwtPayload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string, skewSeconds = 60) => {
  const exp = decodeJwt(token)?.exp;
  if (!exp) return true;
  return exp * 1000 - skewSeconds * 1000 <= Date.now();
};
