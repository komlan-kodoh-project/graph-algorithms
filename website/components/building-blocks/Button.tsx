import styles from "./Button.module.css";
import { ReactNode, useState } from "react";

export type ButtonProps = Readonly<{
  active?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  onClickAsync?: () => Promise<void>;
}>  ;

export function Button({ className, active, disabled, onClick, onClickAsync, children }: ButtonProps) {
  const [internalActive, setInternalActive] = useState<boolean>(false);

  const isActive = active !== undefined ? active : internalActive;

  console.log(active, children, internalActive)

  return (
    <button
      className={`${className} ${styles.button} ${isActive ? styles.active : ""} ${disabled ? styles.disabled : ""}`}
      disabled={disabled}
      onClick={async () => {
        if (onClick !== undefined) {
          setInternalActive(true);
          onClick();
          setTimeout(() => {
            setInternalActive(false);
          }, 300);
        }

        if (onClickAsync !== undefined) {
          setInternalActive(true);
          await onClickAsync();
          setInternalActive(false);
        }
      }}
    >
      {children}
    </button>
  );
}
