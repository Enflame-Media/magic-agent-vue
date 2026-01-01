import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/purchases/index.ts'],
  format: ['esm', 'cjs'],
  tsconfig: 'tsconfig.build.json',
  dts: {
    resolve: true,
  },
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
});
