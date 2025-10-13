import { defineConfig } from "vitepress";

import cnConfig from "./config.cn.mjs";
import enConfig from "./config.en.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/pipel-doc/",
  locales: {
    en: enConfig,
    cn: cnConfig,
  },
  markdown: {
    theme: "github-dark",
  },
  head: [
    ["link", { rel: "icon", href: "/pipel-doc/favicon.ico" }],
    ["link", { rel: "icon", href: "/pipel-doc/logo.svg", sizes: "any", type: "image/svg+xml" }],
  ],
  themeConfig: {
    logo: "/logo.svg",
    socialLinks: [{ icon: "github", link: "https://github.com/pipeljs/pipel" }],
  },
});
