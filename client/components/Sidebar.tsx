"use client";

import Profile from "./Profile";
import CreateNoteDialog from "./dialog/CreateNoteDialog";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="p-2 flex flex-col justify-between h-screen">
      <div className="">
        <CreateNoteDialog />
      </div>

      <div className="flex justify-start items-start flex-col">
        <Link href="/" className="">
          Personel Notes
        </Link>
        <Link href="/notes" className="">
          Public Notes
        </Link>
      </div>

      <Profile />
    </div>
  );
};

export default Sidebar;
