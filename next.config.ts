
import type {NextConfig} from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config) => {
    // Add a rule to handle PDF files
    config.module.rules.push({
      test: /\.pdf$/,
      use: 'raw-loader',
    });
    
    // Copy the pdf.js worker to the public folder
    config.plugins.push(
        new (require('copy-webpack-plugin'))({
            patterns: [
                {
                    from: path.join(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs'),
                    to: 'public/',
                },
            ],
        })
    );

    return config;
  },
};

export default nextConfig;
