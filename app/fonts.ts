import { Rubik_Dirt, Merriweather_Sans } from "next/font/google";

export const rubikDirt = Rubik_Dirt({
  weight: "400", // Rubik Dirt ships as a single weight
  subsets: ["latin"],
  variable: "--font-heading",
});

export const merriweatherSans = Merriweather_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
