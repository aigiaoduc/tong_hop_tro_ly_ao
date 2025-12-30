import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { resolve } from 'path';

// Plugin tùy chỉnh để copy manifest.json và sw.js vào thư mục dist khi build
// vì chúng ta đang để file ở root thay vì thư mục public/
const copyRootFiles = () => {
  return {
    name: 'copy-root-files',
    closeBundle: async () => {
      const files = ['manifest.json', 'sw.js'];
      // Fix: Use resolve('dist') instead of resolve(__dirname, 'dist') to avoid TS error with __dirname
      const outDir = resolve('dist');
      
      if (!fs.existsSync(outDir)) return;

      files.forEach(file => {
        // Fix: Use resolve(file) instead of resolve(__dirname, file)
        const srcPath = resolve(file);
        const destPath = resolve(outDir, file);
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
          console.log(`Copied ${file} to dist`);
        }
      });
    }
  }
};

export default defineConfig({
  plugins: [
    react(), 
    copyRootFiles()
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  publicDir: false // Tắt public dir mặc định vì chúng ta xử lý thủ công
});