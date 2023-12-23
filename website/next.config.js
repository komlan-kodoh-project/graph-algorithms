/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  webpack(config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      ...config.experiments,
    };

    return config;
  },
};

module.exports = nextConfig;
