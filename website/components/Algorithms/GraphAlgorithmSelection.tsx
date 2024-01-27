import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { DijkstraAlgorithmForm } from "./DijkstraAlgorithm/DijkstraAlgorithmForm";
import {
  AlgorithmDopdownValue as AlgorithmDropdownValue,
  GraphAlgorithms,
} from "./AlgorithmDropdown";
import { BreathFirstSearch } from "./BreathFirstAlgorithm/BreathFirstSearchAlgorithmForm";
import { BruteForceMinimumNodeColoringForm } from "./BruteForceMinimumNodecoloring/BruteForceMinimumNodeColoringForm";
import { AnimatePresence, motion } from "framer-motion";
import { ReactComponentElement, ReactNode } from "react";

type GraphAlgorithmSelectionProps = {
  universe: GraphUniverse;
  name: AlgorithmDropdownValue;
};

function AnimationStuff({ children }: { children: ReactNode }) {
  return (
    <motion.div
      key={1}
      className="absolute top-0"
      initial={{ translateY: "6px", opacity: 0 }}
      animate={{ translateY: "0px", opacity: 1 }}
      exit={{ translateY: "6px", opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const componentMap = {
  None: (universe: GraphUniverse) => {
    return <></>;
  },

  "breath-first-traversal": (universe: GraphUniverse) => {
    return (
      <AnimationStuff key={1}>
        <BreathFirstSearch universe={universe}></BreathFirstSearch>
      </AnimationStuff>
    );
  },

  dijkstra: (universe: GraphUniverse) => {
    return (
      <AnimationStuff key={2}>
        <DijkstraAlgorithmForm universe={universe}></DijkstraAlgorithmForm>;
      </AnimationStuff>
    );
  },

  "minimum-node-coloring-brute": (universe: GraphUniverse) => {
    return (
      <AnimationStuff key={3}>
        <BruteForceMinimumNodeColoringForm universe={universe}></BruteForceMinimumNodeColoringForm>
      </AnimationStuff>
    );
  },
} as const;

export function GraphAlgorithmSelection({ name, universe }: GraphAlgorithmSelectionProps) {
  return (
    <div className="relative">
      <AnimatePresence>
        {name != null? componentMap[name](universe): <></>}
      </AnimatePresence>
    </div>
  );
}
