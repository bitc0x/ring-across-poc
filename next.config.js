/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "alexandria-blond.vercel.app" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      "@react-native-async-storage/async-storage": false,
    };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};
module.exports = nextConfig;
