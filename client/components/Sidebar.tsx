"use client";

import Profile from "./Profile";
import CreateNoteDialog from "./dialog/CreateNoteDialog";
import Link from "next/link";
import { Separator } from "./ui/separator";

const Sidebar = () => {
  return (
    <div className="p-2 flex flex-col justify-between h-screen">
      <div className="">
        <CreateNoteDialog />
        <Separator className="h-2 w-full "/>
        <div className="flex justify-start items-start flex-col mt-5 px-3 space-y-4">
          <Link href="/" className="text-white text-lg">
            Personel Notes
          </Link>
          <Link href="/notes" className="text-white text-lg">
            Public Notes
          </Link>
        </div>
      </div>

      <Profile />
    </div>
  );
};

export default Sidebar;
