"use client";
import useWebAssembly from "@/utils/useWebAssembly";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect } from "react";

const GraphContainer = dynamic(() => import("@/components/GraphContainer"), {
  ssr: false,
}); 

export default function Editor() {
  return (
    <div className="h-full w-full text-gray-900">
        <GraphContainer />
    </div>
  );
}
