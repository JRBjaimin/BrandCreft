// tsc doesn't copy non-.ts source files to outDir — the compiled JS still
// `require()`s the Lottie JSON by relative path, so it must exist in dist too.
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src', 'lottie');
const distDir = path.join(__dirname, '..', 'dist', 'lottie');

fs.mkdirSync(distDir, { recursive: true });
for (const file of fs.readdirSync(srcDir)) {
  fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
}
console.log(`copied ${fs.readdirSync(srcDir).length} lottie asset(s) to dist/lottie`);
