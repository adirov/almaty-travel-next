import { defineConfig } from 'vite';
export default defineConfig({base:'/almaty-travel-next/',build:{rollupOptions:{output:{manualChunks:{three:['three'],motion:['gsap']}}}}});
