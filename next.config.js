/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["spoonacular.com", "example.com", "another-domain.com"],
  },
};

module.exports = nextConfig;
