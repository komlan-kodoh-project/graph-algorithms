"use client";

import { WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";
import {
  AlgorithmDropdown,
  AlgorithmDropdownValue,
} from "@/components/Algorithms/AlgorithmDropdown";
import {
  GraphUniverseContext,
  GraphUniverseContextProvider,
} from "@/components/GraphUniverseContext";
import { DeleteButton } from "@/components/svg-buttons/DeleteButton";
import EditButton from "@/components/svg-buttons/EditButton";
import PointerButton from "@/components/svg-buttons/PointerButton";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function LayoutWrapper({ children }: LayoutProps) {
  return (
    <GraphUniverseContextProvider>
      <Layout>{children}</Layout>
    </GraphUniverseContextProvider>
  );
}

const GraphContainer = dynamic(() => import("@/components/GraphContainer"), { ssr: false });

function extractAlgorithmName(): AlgorithmDropdownValue | null {
  const regex = /\/editor\/([a-zA-Z-]+)/; // Regular expression to match the algorithm name
  const match = RegExp(regex).exec(window.location.href); // Matching the regex with the URL
  console.log(match)
  if (match) {
    return match[1] as AlgorithmDropdownValue; // Returning the matched algorithm name
  } else {
    return null; // Return null if no match found
  }
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const { hasInitiated, universe } = useContext(GraphUniverseContext);
  const [editorState, setEditorState] = useState<WellKnownGraphUniverseState>();

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmDropdownValue | null>(null);

  useEffect(() => {
    if (!hasInitiated) {
      return;
    }

    universe().listener.addEventListener("stateUpdatedEvent", (event) => {
      setEditorState(event.currentState.wellKnownStateName());
    });

    universe().generateRandomGraph(10);

    updateEditorState(WellKnownGraphUniverseState.Exploring);
  }, [universe]);

  useEffect(() => {
    if (selectedAlgorithm === null) {
      setSelectedAlgorithm(extractAlgorithmName());
      return;
    }

    const newUrl = `/editor/${selectedAlgorithm}`;

    if (selectedAlgorithm === "None") {
      router.push(`/editor`);
    } else if (!window.location.href.includes(newUrl)) {
      router.push(`/editor/${selectedAlgorithm}`);
    }
  }, [selectedAlgorithm]);

  const updateEditorState = (newState: WellKnownGraphUniverseState) => {
    if (!hasInitiated) {
      throw Error("Attempt to edit state when the universe has not yet been initialized");
    }

    universe().setWellKnownState(newState);
  };

  return (
    <div className="relative w-full h-full outline-4 outline-primary-color text-sm">
      <div className="absolute inline-flex gap-2 top-3.5 left-3.5 z-20 h-9 rounded bg-white px-1.5 py-1 shadow">
        <PointerButton
          active={editorState === WellKnownGraphUniverseState.Exploring}
          onClick={(_) => updateEditorState(WellKnownGraphUniverseState.Exploring)}
        />

        <EditButton
          active={editorState === WellKnownGraphUniverseState.Editing}
          onClick={(_) => updateEditorState(WellKnownGraphUniverseState.Editing)}
        />

        <DeleteButton
          active={editorState === WellKnownGraphUniverseState.Deleting}
          onClick={(_) => updateEditorState(WellKnownGraphUniverseState.Deleting)}
        />
      </div>

      <motion.div
        initial={{ top: "0.875rem", right: "0.875rem", width: "20rem" }}
        animate={
          selectedAlgorithm === null || selectedAlgorithm === "None"
            ? { top: "0.875rem", right: "0.875rem", width: "20rem" }
            : { top: "0rem", right: "0rem", width: "24rem" }
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute inline-flex gap-2 top-3.5 z-30 h-9 bg-slate-50 border-top rounded  py-1 shadow"
      >
        <AlgorithmDropdown onChange={setSelectedAlgorithm} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={
          selectedAlgorithm === null || selectedAlgorithm === "None"
            ? { opacity: 0 }
            : { opacity: 1 }
        }
        transition={{ duration: 0.5, ease: "easeOut", delayChildren: 0.5 }}
        className="absolute gap-2 top-9 bottom-0 z-20 py-0 right-0 w-[35em] p-3 mt-3 pt-3 border-blue-400 border-t-2 shadow overflow-y-scroll scroll-bar rounded bg-slate-50"
      >
        {children}
      </motion.div>

      <div className="absolute top-0 bottom-0 left-0 right-0 z-10 ">
        <GraphContainer />
      </div>
    </div>
  );
}
