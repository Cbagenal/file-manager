import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "5c326pbfnl.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;