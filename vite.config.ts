/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    peerDepsExternal(),
    visualizer(),
    dts({
      insertTypesEntry: true,
      // This is a workaround to force the generated index.d.ts to use the const keyword for the TRoutes generic
      // This is needed because the dts plugin does not support TypeScript 5.0 yet.
      // Will be removed when it does.
      afterBuild() {
        const indexDtsRouterPath = path.resolve(__dirname, 'dist/features/router/index.d.ts')
        const indexDtsRouter = fs.readFileSync(indexDtsRouterPath, 'utf8')
        const indexDtsRouterLines = indexDtsRouter.split('\n')
        indexDtsRouterLines[2] = indexDtsRouterLines[2].replace(
          'AuthLevel extends string, TRoutes extends Routes<AuthLevel>',
          'AuthLevel extends string, const TRoutes extends Routes<AuthLevel>'
        )
        fs.writeFileSync(indexDtsRouterPath, indexDtsRouterLines.join('\n'))
      },
    }),
  ],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'interop-fe-commons',
      fileName: (format) => `index.${format}.js`,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'lcov'],
    },
  },
})
