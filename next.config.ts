import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Tree-shake solo los íconos/componentes importados en lugar de cargar todo el paquete
    optimizePackageImports: ["framer-motion", "react-icons"],
  },
};

export default nextConfig;
