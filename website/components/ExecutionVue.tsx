import { GraphAlgorithmExecution } from "@/GraphUniverse/Algorithm/AlgorithmExecutor";
import { Drawer } from "./Drawer/Drawer";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type ExecutionProps = Readonly<{
  content: string;
}>;

export function ExecutionVue({ content }: ExecutionProps) {
  return (
    <div className="mt-2">
      <Drawer title="Execution Summary">
        {content ? (
          <Markdown className={"markdown"} remarkPlugins={[remarkGfm]}>
            {content}
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
  );
}
