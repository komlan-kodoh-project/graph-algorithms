"use client";

import { useGraphUniverseForm } from "@/components/forms/FormProp";
import { DepthFirstSearchAlgorithm, DepthFirstSearchConfig } from "./AlgorithmImplementation";
import { AlgorithmForm } from "@/components/AlgorithmForm";

function BreathFirstSearch() {
  // Create a new graph universe form that accepts depth firs search config as input and return a depth first search algorithm
  const formData = useGraphUniverseForm<DepthFirstSearchConfig, DepthFirstSearchAlgorithm>(
    (config, universe) => {
      return new DepthFirstSearchAlgorithm(universe.graph, {
        startVertex: config.startVertex,
        targetVertex: config.targetVertex
      });
    }
  );

  return (
    <AlgorithmForm
      inputs={[
        {
          displayName: "start vertex", 
          name: "startVertex",
          type: "vertex",
        },
        {
          displayName: "Target vertex", 
          name: "targetVertex",
          type: "vertex",
        },
      ]}
      explanation={`
# Depth First search
Fancy algorithn that does some cool stuff
      `}
      formData={formData}
      summary={`Explanation of the depth first search algorithm ${formData.formValues.startVertex?.id}`}
    />
  );
}

const markdown = ``;

export default BreathFirstSearch;
