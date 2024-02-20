import { InteractiveButtonProps } from "./InteractiveButtonProps";

export type PointerSVGProps = InteractiveButtonProps & {
  color?: string;
};

export function DeleteButton({ active, onClick , color}: Readonly<PointerSVGProps>) {
  const restColor = "#444647";
  const activeColor = "#eb4d58";

  return (
    <button
      onClick={onClick}
      className={`h-full p-1 transition-all duration-250 ease-in-out ${active && "rounded shadow"}`}
    >
      <svg
        style={{ scale: 0.8 }}
        className="h-full"
        fill="none"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M80 20L20 80M20.0001 20L80 80"
          stroke={color || (active ? activeColor : restColor)}
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
