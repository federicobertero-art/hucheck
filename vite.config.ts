import { getNodeModule } from 'material-hu/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', '@emotion/cache'],
  },
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
