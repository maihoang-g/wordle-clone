'use strict';

const { build } = require('esbuild');

(async () => {
  await build({
    entryPoints: ['routes/index.js'],
    allowOverwrite: true,
    bundle: true,
    minify: false,
    sourcemap: false,
    format: 'cjs',
    outfile: 'public/main.js',
  });
})();
