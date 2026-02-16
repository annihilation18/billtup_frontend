
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'stripe@17.4.0': 'stripe',
        'sonner@2.0.3': 'sonner',
        'react-hook-form@7.55.0': 'react-hook-form',
        'lucide-react@0.468.0': 'lucide-react',
        '@stripe/stripe-js@4.0.0': '@stripe/stripe-js',
        '@stripe/react-stripe-js@2.8.0': '@stripe/react-stripe-js',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });