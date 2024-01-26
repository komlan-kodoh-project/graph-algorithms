import { useState } from "react";
import Select from "react-select";

export type AlgorithmDopdownValue = (typeof GraphAlgorithms)[number]["value"] | null;

export type AlgorithmDropdownProp = {
  onChange: (algorithm: AlgorithmDopdownValue) => void;
};

export const GraphAlgorithms = [
  { value: "None", label: "Select An Algorithm" },
  { value: "dijkstra", label: "Dijkstra Algorithm" },
  { value: "minimum-node-coloring-brute", label: "Exhaustive Minimum Node Coloring" },
  { value: "breath-first-traversal", label: "Breath First Traversal" },
] as const;

export function AlgorithmDropdown({ onChange }: AlgorithmDropdownProp) {
  return (
    <Select
      className="w-full"
      placeholder="Select An Algorithm"
      styles={{
        control: (provided, state) => ({
          ...provided,
          height: "100%",
          minHeight: "100%",
          border: "none",
          boxShadow: "none",
          padding: "0px 3px "
        }),

        valueContainer: (provided, state) => ({
          ...provided,
          height: "100%",
          width: "100%",
          maxWidth: "100%",
          padding: "0 6px",
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
