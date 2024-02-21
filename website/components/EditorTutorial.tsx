import { useState, useTransition } from "react";
import { Modal } from "./Modal/Modal";
import { useEffectOnce } from "@/utils/hooks";
import { TutorialStep } from "./TutorialStep/TutorialStep";
import { Button } from "./building-blocks/Button";

const editorTutorialSteps = [
  {
    imageUrl:
      "https://images.ctfassets.net/zh3fom3plzla/4dO4fkU9CmueHNDRAW9PVz/275c0e40667f89cd286f16888dc1ff69/Screenshot_from_2024-02-20_17-00-50.png",
    imageAlt: "Hello my",
    description: `# Toggle Deletion Mode `,
  },
  {
    imageUrl:
      "https://images.ctfassets.net/zh3fom3plzla/2tIRvTs13FiZAlWuaFfu25/5443b868f6df7be5eb7f85dae19073f0/Screenshot_from_2022-07-19_11-58-49.png",
    imageAlt: "Close schreenshot of the deletion mode",
    description: "# Hey might be your first time here 👋. How about a little tour.",
  },
  {
    imageUrl:
      "https://images.ctfassets.net/zh3fom3plzla/6uizWDgyQmeR8f0CQDLpXu/f65b4606d49e1519401d2828760d0429/Algorithm_visualization__2_.png",
    imageAlt: "Hello my",
    description: "# Hey might be your first time here 👋. How about a little tour.",
  },
];

export function EditorTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [setTransitionIsPending, startStepTransition] = useTransition();

  useEffectOnce(() => {
    const firstVisitFlag = localStorage.getItem("firstVisitFlag");

    if (firstVisitFlag) {
      return;
    }

    setIsOpen(true);
    localStorage.setItem("firstVisitFlag", "firstVisitFlag"); // TODO: Uncomment this line to enable the modal
  });

  const step = editorTutorialSteps[currentStep];

  const nextStep = () => {
    startStepTransition(() => {
      setCurrentStep((step) => step + 1);
    });
  };

  return (
    <Modal className="p-4 flex flex-col gap-4" isOpen={isOpen} setIsOpen={setIsOpen}>
      <TutorialStep
        imageUrl={step.imageUrl}
        imageAlt={step.imageAlt}
        description={step.description}
      />
      <div className="m-auto flex gap-4">
        <Button className=" bg-slate-400 text-white" onClick={() => setIsOpen(false)}>
          Close
        </Button>
        <Button
          className="bg-blue-500 text-white"
          onClick={nextStep}
          disabled={currentStep === editorTutorialSteps.length - 1}
        >
          Next
        </Button>
      </div>
    </Modal>
  );
}
