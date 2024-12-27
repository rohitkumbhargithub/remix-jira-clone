import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { vercelPreset} from '@vercel/remix/preset';

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    vercelPreset(), 
  ],
  build: {
    sourcemap: true,  
  },
});
