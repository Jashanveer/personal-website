import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify serves each deploy behind long-lived CDN caches. Version every
  // asset request so a returning browser cannot mix chunks from two builds.
  deploymentId:
    process.env.DEPLOY_ID ?? process.env.BUILD_ID ?? process.env.COMMIT_REF,
  images: {
    // Next 16 requires explicit qualities. Default is [75]; we use 90 for
    // project screenshots and 92 for the hero portrait.
    qualities: [75, 90, 92],
  },
};

export default nextConfig;
