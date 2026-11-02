import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"Smart Campus AI Assistant",description:"Asisten akademik berbasis Fuzzy Logic, Rule-Based, CBR, dan A* Planner."};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="id"><body>{children}</body></html>;
}
