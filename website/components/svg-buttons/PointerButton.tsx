import {InteractiveButtonProps} from "./InteractiveButtonProps";

export type PointerSVGProps = InteractiveButtonProps & {}

function PointerButton({active, onClick}: PointerSVGProps) {
    const restColor = "#444647";
    const activeColor = "rgb(59 130 246)";

    return <button
        onClick={onClick}
        className={`h-full p-1 transition duration-250 ${active && "rounded shadow"}`}
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="h-full">
            <path
                className="transition-all duration-250"
                d="M92.7133 54.6485L23.3694 11.8173C21.7298 10.8044 19.6413 10.7277 17.9238 11.6167C16.207 12.506 15.1366 14.2191 15.1334 16.0828L15 94.8998C14.9964 97.0623 16.4251 98.9912 18.5631 99.7101C19.144 99.9056 19.7423 100 20.335 100C21.923 100 23.4662 99.3222 24.4985 98.0934C24.4985 98.0934 37.273 75.5124 49.9176 67.8502C62.5622 60.188 90.3452 63.9882 90.3452 63.9882C92.6006 63.7726 94.4671 62.2211 95 60.1194C95 58.2812 94.6162 55.8236 92.7133 54.6485Z"
                fill={active ? activeColor : restColor}
            />
        </svg>
    </button>
}

export default PointerButton;