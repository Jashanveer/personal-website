import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires explicit qualities. Default is [75]; we use 90 for
    // project screenshots and 92 for the hero portrait.
    qualities: [75, 90, 92],
  },
};

export default nextConfig;
