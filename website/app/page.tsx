"use client";
import useWebAssembly from "@/utils/useWebAssembly";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect } from "react";
import { greet } from "wasm-lib";

const GraphContainer = dynamic(() => import("@/components/GraphContainer"), {
  ssr: false,
}); 

export default function Home() {
  return (
    <>
        Wrong page
    </>
  );
}
