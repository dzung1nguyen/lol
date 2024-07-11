import { Montserrat } from "next/font/google";

export const primary = Montserrat({
  variable: "--font-primary",
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});
