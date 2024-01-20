import styles from './Button.module.css';
import { ReactNode, useState } from "react";

export type ButtonProps = {
  active?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  onClickAsync?: () => Promise<void>;
};

export function Button({
  className,
  active,
  onClick,
  onClickAsync,
  children,
}: ButtonProps) {
  const [internalActive, setIsActive] = useState<boolean>(false);

  const isActive = active !== undefined ? active : internalActive;

  return (
    <button
      className={`${className} ${styles.button} ${isActive ? styles.buttonActive : ""}`}
      onClick={async () => {
        if (onClick !== undefined) {
          onClick();
        }

        if (onClickAsync !== undefined) {
          setIsActive(true);
          await onClickAsync();
          setIsActive(true);
        }
      }}
    >
      {children}
    </button>
  );
}
