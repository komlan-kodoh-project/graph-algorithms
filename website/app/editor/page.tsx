"use client";
import dynamic from "next/dynamic";

const GraphContainer = dynamic(() => import("@/components/GraphContainer"), {
  ssr: false,
}); 

export default function Editor() {
  return (
    <div className="h-full w-full text-gray-700">
        <GraphContainer />
    </div>
  );
}
