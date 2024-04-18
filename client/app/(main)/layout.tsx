import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/Auth";
import "../globals.css";
import Sidebar from "@/components/sidebar/Sidebar";

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
        <main className="flex">
          <AuthProvider>
            <div className="bg-[#202123] max-w-xs min-h-screen overflow-y-auto md:min-w-[20rem]">
              <Sidebar />
            </div>
            <div className="bg-[#313338] flex-1">
              {children}
              <Toaster
                position="top-right"
                richColors
                closeButton
                duration={2000}
                pauseWhenPageIsHidden
                visibleToasts={1}
              />
            </div>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
