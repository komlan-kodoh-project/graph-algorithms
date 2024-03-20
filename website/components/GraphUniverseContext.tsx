'use client'

import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { AnyValue } from "@/utils/types";
import { createContext, useMemo, useState } from "react";

export type GraphUniverseVertexData = {
};

export type GraphUniverseEdgeData = {

};


export type GraphUniverseContextValue = {
  hasInitiated: boolean;
  universe: () => GraphUniverse<GraphUniverseVertexData, GraphUniverseEdgeData>;
  setUniverse: (universe: GraphUniverse<GraphUniverseVertexData, GraphUniverseEdgeData>) => void;
};

export const GraphUniverseContext = createContext<GraphUniverseContextValue>({
  hasInitiated: false,
  universe: () => {
    throw new Error("No graph universe provider defined");
  },
  setUniverse: () => {
    throw new Error("No graph universe provider defined");
  },
});

export const GraphUniverseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasInitiated, setHasInitiated] = useState(false);
  const [universe, setUniverse] = useState<GraphUniverse<GraphUniverseVertexData, GraphUniverseEdgeData> | null>(null);

  const context = useMemo<GraphUniverseContextValue>(
    () => ({
      hasInitiated: hasInitiated,

      universe: () => {
        if (universe === null) {
          throw new Error("Graph universe has not yet been initialized");
        }

        return universe;
      },
      setUniverse: (newUniverse) => {
        setHasInitiated(true);
        setUniverse(newUniverse);
      },
    }),
    [universe]
  );

  return <GraphUniverseContext.Provider value={context}>{children}</GraphUniverseContext.Provider>;
};
