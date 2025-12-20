import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function objectLogger(obj: unknown, message?: String) {
  const seen = new WeakSet();

  const json = JSON.stringify(
    obj,
    (_key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Circular]";
        seen.add(value);
      }
      return value;
    },
    2,
  );
  message ?
    console.log(message, json)
    :
    console.log(json)
}

export function isObject(v: unknown): v is Record<string, any> {
  return typeof v === "object" && v !== null;
}
