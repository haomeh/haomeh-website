// A build-time URL prefix, independent of the requested page's directory.
export function getBasePath(value = process.env.BASE_PATH ?? "/") {
  const base = value.endsWith("/") ? value : `${value}/`;
  if (
    !/^\/(?:[A-Za-z0-9._~-]+\/)*$/.test(base) ||
    base.split("/").some((part) => part === "." || part === "..")
  ) {
    throw new Error(
      "BASE_PATH must be an absolute site path such as / or /haomeh-website/.",
    );
  }
  return base;
}

export function prefixSiteUrls(html, basePath) {
  return html.replace(/\b(href|src)="([^"]+)"/g, (attribute, name, url) => {
    // Hash-only links must stay on the actual requested URL, including a 404.
    if (/^(?:#|\/|[a-z][a-z\d+.-]*:)/i.test(url)) return attribute;
    return `${name}="${basePath}${url}"`;
  });
}
