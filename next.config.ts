
import type {NextConfig} from 'next';
import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

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
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs'),
                    to: path.join(__dirname, 'public'),
                },
            ],
        })
    );

    return config;
  },
};

export default nextConfig;
