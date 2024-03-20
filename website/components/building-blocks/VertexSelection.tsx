export type VertexSelectionProps = Readonly<{
  value: string | null | undefined;
}>;

export function VertexSelection({ value }: VertexSelectionProps) {
  return (
    <div
      className={
        " inline-flex mx-2 items-center  rounded justify-center transition-all duration-200 w-6 h-6 " +
        (value ? "popped" : "cave")
      }
    >
      <span>{value ?? ""}</span>
    </div>
  );
}
