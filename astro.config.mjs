import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel({ functionPerRoute: false }),
  site: 'https://ksatria2028.vercel.app',
});
