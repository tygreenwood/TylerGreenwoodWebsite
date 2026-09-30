import type { Config } from "@react-router/dev/config";

export default {
  // No server at runtime: the page is rendered to static HTML at build time, so `build/client/` can be served by any plain file server.
  ssr: false,
  prerender: ["/"],
} satisfies Config;
