import { contentfulLoader } from "@/utils/image-loader";
import Image, { StaticImageData } from "next/image";
import { Button } from "../building-blocks/Button";
import Markdown from "react-markdown";
import { DeleteButton } from "../svg-buttons/DeleteButton";

export type TutorialStepProps = Readonly<{
  imageAlt: string;
  description: string;
  imageUrl: string | StaticImageData;
}>;

export function TutorialStep({ imageUrl, imageAlt, description }: TutorialStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <Markdown>{description}</Markdown>
      <Image
        width={450}
        height={250}
        objectFit="cover"
        className="rounded"
        loader={contentfulLoader}
        src={imageUrl}
        alt={imageAlt}
      ></Image>
    </div>
  );
}
