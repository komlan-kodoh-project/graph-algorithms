"use client";
import dynamic from "next/dynamic";

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
