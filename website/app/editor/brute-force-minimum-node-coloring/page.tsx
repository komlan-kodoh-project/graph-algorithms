"use client";

import { GraphAlgorithmBuilder, useGraphUniverseForm } from "@/components/forms/FormProp";
import {
  BruteForceMinimumNodecoloring,
  BruteForceMinimumNodecoloringConfig,
} from "./BruteForceMinimumNodeColoring";
import Markdown from "react-markdown";
import { Button } from "@/components/building-blocks/Button";
import { Drawer } from "@/components/Drawer/Drawer";
import remarkGfm from "remark-gfm";

const BruteForceMinimumNodeColoringBuilder: GraphAlgorithmBuilder<
  BruteForceMinimumNodecoloringConfig,
  BruteForceMinimumNodecoloring
> = (_, universe) => {
  return new BruteForceMinimumNodecoloring(universe.graph);
};

export default function BruteForceMinimumNodeColoringForm() {
  const { execution } = useGraphUniverseForm<
    BruteForceMinimumNodecoloringConfig,
    BruteForceMinimumNodecoloring
  >(BruteForceMinimumNodeColoringBuilder);

  return (
    <div className={"h-full"}>
      <form className="grid grid-cols-1 gap-y-2" onSubmit={(e) => e.preventDefault()}>
        <div className="p-2">Click start to exhaustively search for the minimum node coloring</div>

        <div className="flex  gap-3">
          <Button className="flex-1 bg-blue-500 text-white" onClick={execution.start}>
            Start
          </Button>

          <Button className="flex-1" onClick={execution.reset}>
            Reset
          </Button>
        </div>
      </form>

      <div className="mt-2">
        <Drawer title="Execution Summary">
          {execution.explanation ? (
            <Markdown className={"markdown"} remarkPlugins={[remarkGfm]}>
              {execution.explanation}
            </Markdown>
          ) : (
            <div className="flex items-center justify-center h-60">
              <p className="text-center max-w-64 border p-4">
                Click move forward to enable execution summary
              </p>
            </div>
          )}
        </Drawer>
      </div>

      <div className="separator mt-4 mb-2"></div>

      <Markdown className={"markdown py-2"}>{markdown}</Markdown>
    </div>
  );
}

const markdown = `
# Understanding Brute-Force Minimum Node Coloring

Node coloring, particularly the task of minimizing the number of colors used, is a classic problem in graph theory. It's known to be NP-complete, meaning that there's no known polynomial-time algorithm that can solve it for all cases. As a result, finding an optimal solution often requires exhaustive search methods like brute force.

## How Brute-Force Minimum Node Coloring Works

1. **Initialization**: The algorithm begins by initializing the color of each node to an empty set.

2. **Color Assignment**: It systematically assigns colors to each node, one at a time, by trying all possible color combinations.

3. **Conflict Checking**: After assigning a color to a node, the algorithm checks if there are any conflicts with adjacent nodes. If a conflict is detected (i.e., two adjacent nodes have the same color), the algorithm backtracks and tries a different color for the current node.

4. **Backtracking**: If a conflict is encountered, the algorithm backtracks to the previous node and tries a different color. This process continues until a valid coloring for the entire graph is found.

5. **Optimization**: Although brute force is used to explore all possible color combinations, certain optimizations can be applied to reduce the search space and improve performance, such as considering the ordering of nodes or using heuristics to guide the search.

## Applications

- **Graph Coloring Problems**: The brute-force minimum node coloring algorithm is commonly used to solve graph coloring problems, where the goal is to assign colors to vertices of a graph in such a way that no two adjacent vertices have the same color.
- **Register Allocation**: In compiler design, the algorithm can be applied to register allocation, where variables in a program are assigned to hardware registers in such a way that no two variables that are live at the same time are assigned to the same register.
- **Scheduling Problems**: It can also be used in scheduling problems, such as timetable scheduling or task assignment, where resources need to be allocated efficiently without conflicts.

The brute-force minimum node coloring algorithm provides an exact solution to graph coloring problems but may become impractical for large graphs due to its exponential time complexity.

## The Challenge of Node Coloring

In graph theory, node coloring involves assigning colors to the vertices of a graph in such a way that no two adjacent vertices share the same color. The minimum number of colors needed to color a graph is called its chromatic number. Determining the chromatic number is a fundamental problem in graph theory and has practical applications in scheduling, register allocation, and network design.

## Why Brute Force?

Brute-force minimum node coloring involves systematically trying all possible color combinations until an optimal solution is found. While this approach guarantees an optimal solution, it becomes impractical for large graphs due to its exponential time complexity. However, for smaller graphs or instances where an exact solution is necessary, brute force remains a viable option.

## Alternatives to Brute Force

Given the impracticality of brute force for large graphs, alternative heuristic methods have been developed. These methods may not guarantee an optimal solution but often provide near-optimal solutions in a fraction of the time. Heuristic approaches include greedy coloring algorithms, local search methods, and genetic algorithms. While these methods sacrifice optimality for efficiency, they are indispensable in practice for solving large-scale node coloring problems.

## Conclusion

Node coloring is a challenging problem with broad applications in various fields. While brute force ensures an optimal solution, its exponential time complexity limits its practicality for large graphs. As a result, researchers continue to explore and develop heuristic methods that balance efficiency with solution quality, making node coloring accessible for real-world applications.

** **Crafted with insights from ChatGPT** **

`;
