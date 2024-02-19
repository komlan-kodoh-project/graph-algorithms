import { FormProp, useGraphUniverseForm } from "@/components/forms/FormProp";
import { Button } from "../../building-blocks/Button";
import {
  MaximumIndependentSetAlgorithm,
  MaximumIndependentSetAlgorithmConfig,
} from "./MaximumIndependentSetAlgorithm";
import { GraphAlgorithmExecution } from "@/GraphUniverse/Algorithm/AlgorithmExecutor";
import Markdown from "react-markdown";

export type DijkstraAlgorithmForm = FormProp & {};

export function MaximumIndependentSetAlgorithmForm({ universe }: DijkstraAlgorithmForm) {
  useGraphUniverseForm<MaximumIndependentSetAlgorithmConfig>(universe);

  const startAlgorithm = async () => {
    const newAlgorithmExecution = new MaximumIndependentSetAlgorithm({
      graph: universe.graph,
      setVertexStyle: {
        innerColor: universe.configuration.darkAccent.light,
        borderColor: universe.configuration.darkAccent.dark,
      },
    });

    const newAlgorithmExecutor = new GraphAlgorithmExecution(newAlgorithmExecution, universe);

    await newAlgorithmExecutor.StartExecution();
  };

  return (
    <div className={"h-full"}>
      <form className="grid grid-cols-1 gap-y-2" onSubmit={(e) => e.preventDefault()}>
        <div className="p-2">Reveal maximum independent set</div>

        <div className="flex  gap-3">
          <Button className="flex-1 bg-blue-500 text-white" onClickAsync={startAlgorithm}>
            Start
          </Button>

          <Button className="flex-1" onClick={() => universe.resetAllDisplayConfiguration()}>
            Reset
          </Button>
        </div>
      </form>

      <div className="separator"></div>

      <Markdown className={"markdown py-2"}>{markdown}</Markdown>
    </div>
  );
}

const markdown = `
# Understanding Maximum Independent Set

The maximum independent set (MIS) is a fundamental problem in graph theory that seeks to find the largest possible subset of vertices in a graph such that no two vertices in the subset are adjacent. It's a classic combinatorial optimization problem with numerous applications in computer science, including scheduling, wireless communication, and bioinformatics.

## The Importance of Maximum Independent Set

In graph theory, an independent set represents a set of vertices where no two vertices are adjacent. The maximum independent set is particularly significant as it identifies the largest subset of vertices that can be selected without any pairwise adjacency constraints. This problem is NP-hard, meaning that finding an optimal solution is computationally challenging for large graphs.

## How Maximum Independent Set is Found

1. **Initialization**: The algorithm starts with an empty set.

2. **Exploration**: It systematically explores all possible subsets of vertices.

3. **Validation**: For each subset, the algorithm checks if it forms an independent set by ensuring that no two vertices in the subset are adjacent.

4. **Optimization**: Throughout the exploration process, the algorithm maintains the largest independent set found so far.

5. **Termination**: The algorithm terminates once all possible subsets have been explored.

## Applications of Maximum Independent Set

- **Resource Allocation**: In wireless communication networks, finding a maximum independent set of nodes allows for efficient channel allocation, minimizing interference between adjacent nodes.
- **Scheduling**: In job scheduling problems, identifying a maximum independent set of tasks ensures that no two conflicting tasks are scheduled simultaneously, leading to improved resource utilization and reduced contention.
- **Genomic Analysis**: In bioinformatics, maximum independent set algorithms are used to identify sets of genes or proteins that interact minimally with each other, aiding in the understanding of biological networks and pathways.

## Conclusion

The maximum independent set problem is a challenging optimization problem with diverse applications across various domains. While finding an optimal solution is computationally demanding, heuristic algorithms and approximation techniques are often employed to find near-optimal solutions efficiently. By identifying independent sets within graphs, researchers and practitioners can address a wide range of real-world problems with practical significance.

** **Crafted with insights from ChatGPT** **

`;

export default MaximumIndependentSetAlgorithmForm;
