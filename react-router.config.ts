import type { Config } from "@react-router/dev/config";

export default {
  // No server at runtime: every route below is rendered to static HTML at
  // build time, so `build/client/` can be served by any plain file server.
  ssr: false,
  prerender: ["/", "/projects", "/about"],
} satisfies Config;
