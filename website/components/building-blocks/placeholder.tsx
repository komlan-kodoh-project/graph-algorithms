export type PlaceHolderProps = Readonly<{
  value: string;
}>;
export function PlaceHolder({ value }: PlaceHolderProps) {
  return (
    <span className={"bg-gray-100 border-b-2 px-0.5 mx-0.5"}>
      {value ?? "_"}
    </span>
  );
}
