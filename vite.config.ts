import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "xeo-webcomponents",
      // the proper extensions will be added
      fileName: "index",
    },
    rollupOptions: {
      // // make sure to externalize deps that shouldn't be bundled
      // // into your library
      external: new RegExp('/examples/.*'),
      // output: {
      //   // Provide global variables to use in the UMD build
      //   // for externalized deps
      //   globals: {
      //     vue: "Vue",
      //   },
      // },
    },
  },
  plugins: [dts({ rollupTypes: true })]
});