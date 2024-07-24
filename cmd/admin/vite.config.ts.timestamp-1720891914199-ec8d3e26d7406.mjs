// vite.config.ts
import basicSsl from "file:///Users/caixw/dev.localized/issue9/cmfx/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";
import autoprefixer from "file:///Users/caixw/dev.localized/issue9/cmfx/node_modules/autoprefixer/lib/autoprefixer.js";
import cssnano from "file:///Users/caixw/dev.localized/issue9/cmfx/node_modules/cssnano/src/index.js";
import { fileURLToPath, URL } from "node:url";
import devtools from "file:///Users/caixw/dev.localized/issue9/cmfx/node_modules/solid-devtools/dist/vite.js";
import tailwindcss from "file:///Users/caixw/dev.localized/issue9/cmfx/node_modules/tailwindcss/lib/index.js";
import { defineConfig } from "file:///Users/caixw/dev.localized/issue9/cmfx/node_modules/vite/dist/node/index.js";
import solidPlugin from "file:///Users/caixw/dev.localized/issue9/cmfx/node_modules/vite-plugin-solid/dist/esm/index.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/caixw/dev.localized/issue9/cmfx/cmd/admin/vite.config.ts";
var vite_config_default = defineConfig({
  root: "./",
  server: {
    host: true
  },
  build: {
    sourcemap: true
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer(), cssnano()]
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../../admin/src", __vite_injected_original_import_meta_url))
    }
  },
  plugins: [
    devtools(),
    solidPlugin(),
    basicSsl({
      name: "test",
      domains: ["localhost"],
      certDir: "./ssl"
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2FpeHcvZGV2LmxvY2FsaXplZC9pc3N1ZTkvY21meC9jbWQvYWRtaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jYWl4dy9kZXYubG9jYWxpemVkL2lzc3VlOS9jbWZ4L2NtZC9hZG1pbi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY2FpeHcvZGV2LmxvY2FsaXplZC9pc3N1ZTkvY21meC9jbWQvYWRtaW4vdml0ZS5jb25maWcudHNcIjsvLyBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDI0IGNhaXh3XG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVFxuXG5pbXBvcnQgYmFzaWNTc2wgZnJvbSAnQHZpdGVqcy9wbHVnaW4tYmFzaWMtc3NsJztcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcbmltcG9ydCBjc3NuYW5vIGZyb20gJ2Nzc25hbm8nO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IGRldnRvb2xzIGZyb20gJ3NvbGlkLWRldnRvb2xzL3ZpdGUnO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHNvbGlkUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLXNvbGlkJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcm9vdDogJy4vJyxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgaG9zdDogdHJ1ZVxuICAgIH0sXG5cbiAgICBidWlsZDoge1xuICAgICAgICBzb3VyY2VtYXA6IHRydWVcbiAgICB9LFxuXG4gICAgY3NzOiB7XG4gICAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcygpLCBhdXRvcHJlZml4ZXIoKSwgY3NzbmFubygpXVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuLi8uLi9hZG1pbi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgZGV2dG9vbHMoKSxcbiAgICAgICAgc29saWRQbHVnaW4oKSxcbiAgICAgICAgYmFzaWNTc2woe1xuICAgICAgICAgICAgbmFtZTogJ3Rlc3QnLFxuICAgICAgICAgICAgZG9tYWluczogWydsb2NhbGhvc3QnXSxcbiAgICAgICAgICAgIGNlcnREaXI6ICcuL3NzbCdcbiAgICAgICAgfSlcbiAgICBdXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFJQSxPQUFPLGNBQWM7QUFDckIsT0FBTyxrQkFBa0I7QUFDekIsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsZUFBZSxXQUFXO0FBQ25DLE9BQU8sY0FBYztBQUNyQixPQUFPLGlCQUFpQjtBQUN4QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGlCQUFpQjtBQVhnTCxJQUFNLDJDQUEyQztBQWN6UCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixNQUFNO0FBQUEsRUFDTixRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUEsRUFDVjtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0gsV0FBVztBQUFBLEVBQ2Y7QUFBQSxFQUVBLEtBQUs7QUFBQSxJQUNELFNBQVM7QUFBQSxNQUNMLFNBQVMsQ0FBQyxZQUFZLEdBQUcsYUFBYSxHQUFHLFFBQVEsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDSjtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSyxjQUFjLElBQUksSUFBSSxtQkFBbUIsd0NBQWUsQ0FBQztBQUFBLElBQ2xFO0FBQUEsRUFDSjtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ0wsU0FBUztBQUFBLElBQ1QsWUFBWTtBQUFBLElBQ1osU0FBUztBQUFBLE1BQ0wsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLFdBQVc7QUFBQSxNQUNyQixTQUFTO0FBQUEsSUFDYixDQUFDO0FBQUEsRUFDTDtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
