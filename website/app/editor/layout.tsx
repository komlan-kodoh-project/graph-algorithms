"use client";

import { WellKnownGraphUniverseEmbedding } from "@/GraphUniverse/Embeddings/Embedding";
import { WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";
import {
  AlgorithmDropdown,
  AlgorithmDropdownValue,
} from "@/components/Algorithms/AlgorithmDropdown";
import { EditorTutorial } from "@/components/EditorTutorial";
import {
  GraphUniverseContext,
  GraphUniverseContextProvider,
} from "@/components/GraphUniverseContext";
import { DeleteButton } from "@/components/svg-buttons/DeleteButton";
import EditButton from "@/components/svg-buttons/EditButton";
import { PhysiscsEngineState } from "@/components/svg-buttons/PhysicsEngineState";
import PointerButton from "@/components/svg-buttons/PointerButton";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState, useTransition } from "react";

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
  if (match) {
    return match[1] as AlgorithmDropdownValue; // Returning the matched algorithm name
  } else {
    return null; // Return null if no match found
  }
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const path = usePathname();

  const { hasInitiated, universe } = useContext(GraphUniverseContext);

  const [editorState, setEditorState] = useState<WellKnownGraphUniverseState>();
  const [universeEngine, setUniverseEngine] = useState<WellKnownGraphUniverseEmbedding>(
    WellKnownGraphUniverseEmbedding.DormantEmbedding
  );

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmDropdownValue | null>(null);
  const [pageTransition, startPageTransition] = useTransition();

  useEffect(() => {
    if (!hasInitiated) {
      return;
    }

    universe().listener.addEventListener("stateUpdatedEvent", (event) => {
      setEditorState(event.currentState.wellKnownStateName());
    });

    universe().listener.addEventListener("embeddingUpdatedEvent", (event) => {
      setUniverseEngine(event.currentEmbedding.wellKnownEmbedingName());
    });

    universe().generateRandomGraph(10, 1);

    updateEditorState(WellKnownGraphUniverseState.Exploring);

    setTimeout(() => {
      updateEditorEngine(WellKnownGraphUniverseEmbedding.PhysicsBasedEmbedding);
    }, 1 * 1000);
  }, [universe]);

  useEffect(() => {
    updateSelectedAlgorithm();
  }, [selectedAlgorithm]);

  async function updateSelectedAlgorithm(): Promise<void> {
    if (selectedAlgorithm === null) {
      setSelectedAlgorithm(extractAlgorithmName());
      return;
    }

    const newUrl = `/editor/${selectedAlgorithm}`;

    if (selectedAlgorithm === "None") {
      startPageTransition(() => {
        router.push(`/editor`);
      });
    } else if (!window.location.href.includes(newUrl)) {
      startPageTransition(() => {
        router.push(`/editor/${selectedAlgorithm}`);
      });
    }
  }

  const updateEditorState = (newState: WellKnownGraphUniverseState) => {
    if (!hasInitiated) {
      throw Error("Attempt to edit state when the universe has not yet been initialized");
    }

    universe().setWellKnownState(newState);
  };

  const updateEditorEngine = (newEmbedding: WellKnownGraphUniverseEmbedding) => {
    if (!hasInitiated) {
      throw Error("Attempt to edit active engine when the universe has not yet been initialized");
    }

    universe().setWellKnownEmbedding(newEmbedding);
  };

  const toggleActiveEngine = (): void => {
    if (universeEngine === WellKnownGraphUniverseEmbedding.PhysicsBasedEmbedding) {
      updateEditorEngine(WellKnownGraphUniverseEmbedding.DormantEmbedding);
      return;
    }

    if (universeEngine === WellKnownGraphUniverseEmbedding.DormantEmbedding) {
      updateEditorEngine(WellKnownGraphUniverseEmbedding.PhysicsBasedEmbedding);
    }
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

        <PhysiscsEngineState
          active={universeEngine === WellKnownGraphUniverseEmbedding.PhysicsBasedEmbedding}
          onClick={(_) => toggleActiveEngine()}
        />
      </div>

      <EditorTutorial />

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
        <AlgorithmDropdown value={selectedAlgorithm ?? "None"} onChange={setSelectedAlgorithm} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={
          selectedAlgorithm === null || selectedAlgorithm === "None"
            ? { opacity: 0, pointerEvents: "none"}
            : { opacity: 1 , pointerEvents: "all"}
        }
        transition={{ duration: 0.5, ease: "easeOut", delayChildren: 0.5 }}
        className="absolute gap-2 top-9 bottom-0 z-20 py-0 right-0 w-[35em] p-4 mt-3 pt-4 border-blue-400 border-t-2 shadow overflow-y-scroll scroll-bar rounded bg-slate-50"
      >
        {pageTransition ? "Loading ..." : children}
      </motion.div>

      <div className="absolute top-0 bottom-0 left-0 right-0 z-10 ">
        <GraphContainer />
      </div>
    </div>
  );
}
