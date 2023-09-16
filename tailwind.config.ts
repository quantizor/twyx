import type { Config } from "tailwindcss";
import { transformTwyxProps } from "./transformer";

export default {
  content: {
    files: ["./demo/**/*.tsx"],
    transform: {
      tsx: transformTwyxProps,
    },
  },
  theme: {
    extend: {},
  },
} as Config;
