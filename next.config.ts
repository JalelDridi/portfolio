import type { NextConfig } from "next";

// The four Potluck case studies became one; old links still land on it.
const OLD_POTLUCK_SLUGS = [
  "potluck-live",
  "payments",
  "realtime-messaging",
  "release-pipeline",
];

const nextConfig: NextConfig = {
  async redirects() {
    return OLD_POTLUCK_SLUGS.map((slug) => ({
      source: `/work/${slug}`,
      destination: "/work/potluck",
      permanent: true,
    }));
  },
};

export default nextConfig;
