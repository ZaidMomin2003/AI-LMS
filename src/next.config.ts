
import type {NextConfig} from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: [
      "https://*.cloudworkstations.dev",
      "https://*.firebase.studio",
    ],
    hmr: {
      path: "/_next/webpack-hmr"
    }
  },
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
      },
       {
        protocol: 'https',
        hostname: 'cdn.rareblocks.xyz',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    // This is to fix the "Module not found: Can't resolve 'child_process'" error
    // See: https://github.com/googleapis/google-auth-library-nodejs/issues/1435
    config.externals.push('child_process');
    
    return config;
  }
};

export default nextConfig;
