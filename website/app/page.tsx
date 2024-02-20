"use client";

import { PhysiscsEngineState } from "@/components/svg-buttons/PhysicsEngineState";
import Link from "next/link";

export default function Editor() {
  return (
    <div className="h-full w-full items-center justify-center flex text-gray-700">
      <div className="text-3xl ">
        <p className="block m-auto">Great Things are comming soon !</p>

        <div className="h-9 flex mt-8 gap-4 items-center">
          <p>Go Back 👉</p>
          <div className="h-9">
            <Link href={"/editor"}>
              <PhysiscsEngineState active={true} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
