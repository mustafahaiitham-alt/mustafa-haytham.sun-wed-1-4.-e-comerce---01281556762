import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // https://ecommerce.routemisr.com/Route-Academy-products/1680403397402-cover.jpeg

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com",
        pathname: "/Route-Academy-*/**",
      },
    ],
  },

  reactCompiler: true,
};

export default nextConfig;