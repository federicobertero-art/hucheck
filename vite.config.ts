import { getNodeModule } from 'material-hu/vite';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 8 creates shared chunks where esbuild init functions are called but
// not imported. This plugin detects missing init_* calls and injects the
// needed imports (or declarations for unexported variants) at transform time.
function fixMuiEmotionChunk() {
  return {
    name: 'fix-mui-emotion-chunk',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      const cleanId = id.split('?')[0];
      if (!cleanId.includes('node_modules/.vite/deps/')) return null;

      // Find all init_* calls and check which ones are undefined in this chunk
      const allCalls = [...code.matchAll(/\b(init_\w+)\(\)/g)].map(m => m[1]);
      const defined = new Set([
        ...[...code.matchAll(/\bas\s+(init_\w+)\b/g)].map(m => m[1]),
        ...[...code.matchAll(/\bvar\s+(init_\w+)\b/g)].map(m => m[1]),
      ]);
      const missing = [...new Set(allCalls)].filter(fn => !defined.has(fn));
      if (missing.length === 0) return null;

      // Find imports from styled-*.js (the chunk that has init functions)
      const importMatch = code.match(/(import\s*\{[^}]*\}\s*from\s*"(\.\/styled-[^"?]+\.js)(?:\?[^"]*)?";?)/);
      if (!importMatch) return null;

      const styledPath = resolve(dirname(cleanId), importMatch[2]);
      let styledCode: string;
      try { styledCode = readFileSync(styledPath, 'utf8'); } catch { return null; }

      let patchedCode = code;
      const extraImports: string[] = [];
      const extraDecls: string[] = [];

      for (const fn of missing) {
        // Case 1: fn exported directly as an alias
        const directAlias = styledCode.match(new RegExp(`${fn}\\s+as\\s+(\\w+)`));
        if (directAlias) {
          extraImports.push(`${directAlias[1]} as ${fn}`);
          continue;
        }
        // Case 2: fn$1 exported — declare fn = fn$1 wrapper
        const variantAlias = styledCode.match(new RegExp(`${fn}\\$1\\s+as\\s+(\\w+)`));
        if (variantAlias) {
          extraImports.push(`${variantAlias[1]} as ${fn}$1`);
          extraDecls.push(`var ${fn} = () => ${fn}$1();`);
        }
      }

      if (extraImports.length === 0 && extraDecls.length === 0) return null;

      if (extraImports.length > 0) {
        patchedCode = patchedCode.replace(
          importMatch[1],
          importMatch[1].replace(/\s*\}\s*from/, `, ${extraImports.join(', ')} } from`)
        );
      }
      if (extraDecls.length > 0) {
        patchedCode = extraDecls.join('\n') + '\n' + patchedCode;
      }
      return { code: patchedCode, map: null };
    },
  };
}

export default defineConfig({
  plugins: [react(), fixMuiEmotionChunk()],
  resolve: {
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled', '@mui/material'],
    alias: {
      '@material-hu/mui/lab': getNodeModule('@mui/lab'),
      '@material-hu/mui/x-date-pickers': getNodeModule('@mui/x-date-pickers'),
      '@material-hu/mui': getNodeModule('@mui/material'),
      '@material-hu/icons/material': getNodeModule('@mui/icons-material'),
      '@material-hu/icons/tabler': getNodeModule('@tabler/icons-react'),
      '@material-hu/hooks': getNodeModule('material-hu/lib/hooks'),
      '@material-hu/utils': getNodeModule('material-hu/lib/utils'),
      '@material-hu/types': getNodeModule('material-hu/lib/types'),
      '@material-hu/styles': getNodeModule('material-hu/lib/styles'),
      '@material-hu/theme': getNodeModule('material-hu/lib/theme'),
      '@material-hu/components': getNodeModule('material-hu/lib/components'),
    },
  },
});
