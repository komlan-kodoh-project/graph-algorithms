/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    loader: "custom",
    path: "./image-loader.js",
  },
  webpack(config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      ...config.experiments,
    };

    return config;
  },
};

module.exports = nextConfig;
