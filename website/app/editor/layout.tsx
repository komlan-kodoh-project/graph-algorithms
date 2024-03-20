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
import { GithubLink } from "@/components/svg-buttons/GithubLink";
import { PhysiscsEngineState } from "@/components/svg-buttons/PhysicsEngineState";
import PointerButton from "@/components/svg-buttons/PointerButton";
import { Snackbar, SnackbarContent } from "@mui/material";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
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

function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const { hasInitiated, universe } = useContext(GraphUniverseContext);

  const [editorState, setEditorState] = useState<WellKnownGraphUniverseState>();
  const [universeEngine, setUniverseEngine] = useState<WellKnownGraphUniverseEmbedding>(
    WellKnownGraphUniverseEmbedding.DormantEmbedding
  );

  const [snackBarIsOpen, setSnackBarIsOpen] = useState(false);
  const [snackBarContent, setSnackBarContent] = useState<string | null>(null);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmDropdownValue | null>(null);
  const [pageTransition, startPageTransition] = useTransition();

  // Use effect that handles initialization events that must take place every time the universe is updated
  useEffect(() => {
    if (!hasInitiated) {
      return;
    }

    // Event listener that ensures that the universe state is kept tracked off
    universe().listener.addEventListener("stateUpdatedEvent", (event) => {
      setEditorState(event.currentState.wellKnownStateName());
    });

    // Event listner that controlls the snack bar that shows when entering the selection states
    universe().listener.addEventListener("stateUpdatedEvent", (event) => {
      if (event.currentState.wellKnownStateName() == WellKnownGraphUniverseState.NodeSelection) {
        setSnackBarContent("Now select a vertex by clicking on it");
        setSnackBarIsOpen(true);
      } else {
        setSnackBarIsOpen(false);
      }
    });

    // Event listener that reacts to any changes in the rendering engine that the universe
    // is using to represent relationships between vertices
    universe().listener.addEventListener("embeddingUpdatedEvent", (event) => {
      setUniverseEngine(event.currentEmbedding.wellKnownEmbedingName());
    });

    // Generate a random graph in the new universe
    universe().generateRandomGraph(10, 1);

    updateEditorState(WellKnownGraphUniverseState.Exploring);

    // Small timeout after universe generation for cool activation effect
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
      <div className="absolute bottom-3.5 left-3.5 z-20 h-9">
        <GithubLink />
      </div>

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
            ? { opacity: 0, pointerEvents: "none" }
            : { opacity: 1, pointerEvents: "all" }
        }
        transition={{ duration: 0.5, ease: "easeOut", delayChildren: 0.5 }}
        className="absolute gap-2 top-9 bottom-0 z-20 py-0 right-0 w-[35em] p-4 mt-3 pt-4 border-blue-400 border-t-2 shadow overflow-y-scroll scroll-bar rounded bg-slate-50"
      >
        {pageTransition ? "Loading ..." : children}
      </motion.div>

      <div className="absolute top-0 bottom-0 left-0 right-0 z-10 ">
        <GraphContainer />
      </div>

      <Snackbar open={snackBarIsOpen} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <SnackbarContent
          message={snackBarContent}
          sx={{
            display: "block",
            width: "100%",
            textAlign: "center",
            fontWeight: "700",
            color: "#444",
            backgroundColor: "rgb(248 250 252)",
            boxShadow: `2px 2px 2px #d7dade, -2px -2px 2px #fafbff,
                        inset 0px 0px 0px rgba(255, 255, 255, 0.7),
                        inset 0px 0px 0px rgba(255, 255, 255, 0.5)
                        `,
          }}
        ></SnackbarContent>
      </Snackbar>
    </div>
  );
}
