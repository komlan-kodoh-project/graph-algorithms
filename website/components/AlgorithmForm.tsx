"use client";

import { GraphUniverseFormDataReturn } from "@/components/forms/FormProp";
import { VertexInputButton } from "@/components/forms/VertexInputButton";
import { Button } from "@/components/building-blocks/Button";
import Markdown from "react-markdown";
import { Drawer } from "@/components/Drawer/Drawer";
import remarkGfm from "remark-gfm";
import { VertexSelection } from "@/components/building-blocks/VertexSelection";

export type AlgorithmFormInputs<T> = {
  name: T;
  type: "vertex";
  displayName: string;
};

export type AlgorithmFormProps<TConfig> = Readonly<{
  summary: string;
  explanation: string;
  inputs: AlgorithmFormInputs<keyof TConfig>[];
  formData: GraphUniverseFormDataReturn<TConfig>;
}>;

export function AlgorithmForm<TConfig extends { [key: string]: any }>({
  summary,
  explanation,
  inputs,
  formData,
}: AlgorithmFormProps<TConfig>) {
  return (
    <div className={"h-full"}>
      <form className="grid grid-cols-1 gap-y-2" onSubmit={(e) => e.preventDefault()}>
        {inputs.map((input, index) => {
          if (input.type === "vertex") {
            return (
              <div key={input.name.toString()} className="flex justify-between gap-x-2">
                <VertexInputButton {...(formData.registerGraphInput(input.name) as any)}>
                    {input.displayName}
                </VertexInputButton>

                <VertexSelection value={formData.formValues[input.name]?.id.toString()} />
              </div>
            );
          }
          return "";
        })}

        <div className="py-2 px-1">{summary}</div>

        <div className="flex  gap-3">
          <Button className="flex-1 bg-blue-500 text-white" onClick={formData.execution.start}>
            Start
          </Button>

          <Button className="flex-1" onClick={formData.execution.moveForward}>
            Move Forward
          </Button>

          <Button className="flex-1" onClick={formData.execution.reset}>
            Reset
          </Button>
        </div>
      </form>

      <div className="mt-2">
        <Drawer title="Execution Summary">
          {formData.execution.explanation ? (
            <Markdown className={"markdown"} remarkPlugins={[remarkGfm]}>
              {formData.execution.explanation}
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

      <Markdown className={"markdown py-2"}>{explanation}</Markdown>
    </div>
  );
}
