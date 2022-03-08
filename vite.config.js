import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

import WindiCSS from 'vite-plugin-windicss'

function pathResolve(dir) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),

  ],
  resolve:{
    alias:[
      {
        find: '@',
        replacement: pathResolve('src') + '/',
      },
      {
        find:"compassql",
        replacement: resolve("node_modules/compassql/build/compassql.js")
      }
    ]
  },
  build:{
    // sourcemap:true,
    // minify:false
  }
})
