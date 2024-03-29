import { KeyboardEvent } from "react";

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function generateRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomColor() {
  let color = "#";
  const letters = "0123456789ABCDEF";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

export function keyDownHandler<T>(keys: string[], callback: (event: KeyboardEvent<T>) => void) {
  return (event: KeyboardEvent<T>) => {
    if (!keys.includes(event.key)) {
      return;
    }

    callback(event)
  };
}
