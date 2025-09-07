import { Rubik_Dirt, Merriweather_Sans } from "next/font/google";

export const rubikDirt = Rubik_Dirt({
  weight: "400", // Rubik Dirt ships as a single weight
  subsets: ["latin"],
  variable: "--font-heading",
  // display: "swap",
});

export const merriweatherSans = Merriweather_Sans({
  // variable font → no weight needed; add weights array if you want fixed styles
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
