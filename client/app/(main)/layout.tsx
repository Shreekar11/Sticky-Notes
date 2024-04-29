import "../globals.css";
import { Poppins } from "next/font/google";
import Sidebar from "@/components/sidebar/Sidebar";

const inter = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex">
          <div className="bg-[#202123] max-w-xs min-h-screen overflow-y-auto md:min-w-[20rem]">
            <Sidebar />
          </div>
          <div className="bg-[#313338] flex-1">{children}</div>
        </main>
      </body>
    </html>
  );
}
