import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/Auth";

const inter = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Sticky Notes",
  description:
    "Sticky Notes is a web application that allows users to create and manage sticky notes, and collaborate with other users. Users can create, edit, and delete their notes, as well as set the privacy of their notes to public or private. They can also view other users' notes that are public. The application includes an admin role with the ability to add, edit, and delete users' notes, view all notes, manage role changes, and promote other users to admin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="">
          <AuthProvider>{children}</AuthProvider>
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={2000}
            pauseWhenPageIsHidden
            visibleToasts={1}
          />
        </main>
      </body>
    </html>
  );
}
