"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const ParticlesCanvas = dynamic(() => import("./ParticlesCanvas"), { ssr: false });
const TechnoBackground = dynamic(() => import("./TechnoBackground"), { ssr: false });

export default function BackgroundSelector() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return isHome ? <ParticlesCanvas /> : <TechnoBackground />;
}
