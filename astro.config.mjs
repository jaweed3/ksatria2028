import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel({ functionPerRoute: true }),
  site: 'https://ksatria2028.vercel.app',
});
