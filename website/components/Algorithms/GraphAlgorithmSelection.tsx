import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { AlgorithmDopdownValue } from "./AlgorithmDropdown";

type GraphAlgorithmSelectionProps = {
  universe: GraphUniverse;
  name: AlgorithmDopdownValue;
};

const BreathFirstSearch = dynamic(
  () => import("./BreathFirstAlgorithm/BreathFirstSearchAlgorithmForm"),
  { ssr: false }
);

const DijkstraAlgorithmForm = dynamic(
  () => import("@/components/Algorithms/DijkstraAlgorithm/DijkstraAlgorithmForm"),
  { ssr: false }
);

const BruteForceMinimumNodeColoringForm = dynamic(
  () => import("./BruteForceMinimumNodecoloring/BruteForceMinimumNodeColoringForm"),
  { ssr: false }
);

const ExcentricityAglgorithmForm = dynamic(
  () => import("./ExcentricityAlgorithm/ExcentricityAlgorithmForm"),
  { ssr: false }
);

const MaximumIndependentSetAlgorithmForm = dynamic(
  () => import("./MaximumIndependentSetAlgorithm/MaximumIndependenttSetAlgorithmForm"),
  { ssr: false }
);

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

  "vertex-excentricity-algorithm": (universe: GraphUniverse) => {
    return (
      <AnimationStuff key={4}>
        <ExcentricityAglgorithmForm universe={universe}></ExcentricityAglgorithmForm>
      </AnimationStuff>
    );
  },

  "maximum-independent-set-exhaustive": (universe: GraphUniverse) => {
    return (
      <AnimationStuff key={5}>
        <MaximumIndependentSetAlgorithmForm universe={universe}></MaximumIndependentSetAlgorithmForm>
      </AnimationStuff>
    );
  },
} as const;

export function GraphAlgorithmSelection({ name, universe }: GraphAlgorithmSelectionProps) {
  return (
    <div className="relative">
      <AnimatePresence>{name != null ? componentMap[name](universe) : <></>}</AnimatePresence>
    </div>
  );
}
