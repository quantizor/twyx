import type { Config } from "tailwindcss";
import { transformJSXProps } from "./transformer";

export default {
  content: {
    files: [],
    transform: {
      tsx: transformJSXProps,
    },
  },
  theme: {
    extend: {},
  },
  plugins: [],
} as Config;
