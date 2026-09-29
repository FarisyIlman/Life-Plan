export function getSiteUrl() {
  const configuredUrl =
    process.env.AUTH_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (!configuredUrl) return new URL("http://localhost:3000");

  return new URL(
    configuredUrl.includes("://") ? configuredUrl : `https://${configuredUrl}`,
  );
}
