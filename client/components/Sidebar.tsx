"use client";

import { useState } from "react";
import Link from "next/link";
import Profile from "./Profile";
import CreateNoteDialog from "./dialog/CreateNoteDialog";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        className="md:hidden fixed top-0 right-0 z-50 mr-3 mt-3"
        onClick={toggleSidebar}
      >
        <div className="w-6 h-6 relative">
          <span className="bg-white absolute left-0 top-0 w-full h-0.5"></span>
          <span className="bg-white absolute left-0 top-1/2 w-full h-0.5"></span>
          <span className="bg-white absolute left-0 bottom-0 w-full h-0.5"></span>
        </div>
      </div>

      {/* <div className="p-2 flex flex-col justify-between h-screen"> */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed inset-y-0 left-0 z-40 transition duration-300 ease-in-out 
        bg-[#202123] overflow-y-auto p-2 md:w-[20rem] flex flex-col justify-between h-screen`}
      >
        <div className="">
          <CreateNoteDialog />

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
    </div>
  );
};

export default Sidebar;
