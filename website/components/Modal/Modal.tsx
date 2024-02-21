import { DeleteButton } from "../svg-buttons/DeleteButton";
import style from "./Modal.module.css";

export type ModalProps = Readonly<{
  isOpen: boolean;
  className: string;
  children: React.ReactNode;
  setIsOpen: (isOpen: boolean) => void;
}>;

export function Modal({ className, isOpen, setIsOpen, children }: ModalProps) {
  return (
    isOpen && (
      <>
        <button
          className={`${style.modalContainer} ${isOpen && style.open}`}
          onClick={() => setIsOpen(false)}
        />
        <div className={`${style.modal} ${className}`}>
          <div className="h-7 absolute top-3 right-4">
            <DeleteButton onClick={() => setIsOpen(false)}/>
          </div>
          {children}
        </div>
      </>
    )
  );
}
