import { GraphAlgorithm } from "@/GraphUniverse/Algorithm/GraphAlgorithm";
import Select from "react-select";

export type AlgorithmDropdownValue = (typeof GraphAlgorithms)[number]["value"] | null;

export type AlgorithmDropdownValueNotNull = (typeof GraphAlgorithms)[number]["value"];

export type AlgorithmDropdownProp = Readonly<{
  value: AlgorithmDropdownValueNotNull;
  onChange: (algorithm: AlgorithmDropdownValue) => void;
}>;

export const GraphAlgorithms = [
  { value: "None", label: "Select An Algorithm" },
  { value: "dijkstra-shortest-path", label: "Dijkstra Algorithm" },
  { value: "brute-force-minimum-node-coloring", label: "Exhaustive Minimum Node Coloring" },
  { value: "breath-first-traversal", label: "Breath First Traversal" },
  { value: "node-excentricity", label: "Find Vertex Excentricity" },
  { value: "maximum-independent-set", label: "Find Maximum Independent Set" },
] as const;

export function AlgorithmDropdown({ value, onChange }: AlgorithmDropdownProp) {
  return (
    <Select
      value={GraphAlgorithms.filter((algorithm) => algorithm.value === value)[0]}
      className="w-full"
      placeholder="Select An Algorithm"
      styles={{
        control: (provided) => ({
          ...provided,
          height: "100%",
          minHeight: "100%",
          border: "none",
          boxShadow: "none",
          padding: "0px 3px ",
          backgroundColor: "rgb(248 250 252)",
        }),

        valueContainer: (provided) => ({
          ...provided,
          height: "100%",
          width: "100%",
          maxWidth: "100%",
          padding: "0 6px",
          backgroundColor: "rgb(248 250 252)",
        }),

        input: (provided, state) => ({
          ...provided,
          margin: "0px",
        }),

        indicatorSeparator: (state) => ({
          display: "none",
        }),

        indicatorsContainer: (provided, state) => ({
          ...provided,
          height: "100%",
        }),
      }}
      onChange={(algorithm) => {
        onChange(algorithm?.value ?? null);
      }}
      options={GraphAlgorithms}
    />
  );
}
