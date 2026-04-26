"use client";

import dynamic from "next/dynamic";

const TechnoBackground = dynamic(() => import("./TechnoBackground"), { ssr: false });

export default function BackgroundSelector() {
  return <TechnoBackground />;
}
