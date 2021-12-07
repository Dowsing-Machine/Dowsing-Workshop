import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

function pathResolve(dir) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{
    alias:[
      {
        find: '@',
        replacement: pathResolve('src') + '/',
      },
      {
        find:"compassql",
        replacement: resolve("node_modules/compassql/build/compassql.min.js")
      }
    ]
  },
  build:{
    sourcemap:true,
    minify:false
  }
})
