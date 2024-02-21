import { PhysiscsEngineState } from "@/components/svg-buttons/PhysicsEngineState";
import Link from "next/link";
import React from "react";

function Custom404() {
  return (
    <div className="h-full w-full flex text-gray-700">
      <div className="m-auto h-9 text-3xl flex gap-4">
        <p className="block m-auto">GET OUT OF HERE 👉</p>
        <Link href={"/editor"}>
          <PhysiscsEngineState active={true} />
        </Link>
      </div>
    </div>
  );
}

export default Custom404;
