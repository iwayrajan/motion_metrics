/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remotion's Node-only rendering packages do their own dynamic requires/webpack-ish
  // things internally — Next must not try to statically bundle them, just require()
  // them natively at runtime in the API route.
  experimental: {
    serverComponentsExternalPackages: ["@remotion/bundler", "@remotion/renderer"],
  },
};
module.exports = nextConfig;
