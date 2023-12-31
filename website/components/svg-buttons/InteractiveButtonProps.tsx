import React from "react";

export type InteractiveButtonProps = {
    active?: boolean,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}