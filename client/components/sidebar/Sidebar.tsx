"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/Auth";
import { RxHamburgerMenu } from "react-icons/rx";

// components
import Profile from "@/components/sidebar/Profile";
import { Separator } from "@/components/ui/separator";
import InviteButton from "@/components/sidebar/InviteButton";
import CreateNoteDialog from "@/components/dialog/CreateNoteDialog";

const Sidebar = () => {
  const { authState: user } = useAuth();
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
          <RxHamburgerMenu className="h-6 w-6 text-white absolute top-3 left-0" />
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

          {user.user.is_admin && <InviteButton />}
          
          <Separator className="my-4 bg-zinc-500" />

          {/* note links */}
          <div className="flex justify-start items-start flex-col mt-5 px-3 space-y-4">
            {!user.user.is_admin && (
              <>
                <Link href="/" className="text-white text-lg">
                  Personel Notes
                </Link>
                <Link href="/public-notes" className="text-white text-lg">
                  Public Notes
                </Link>
              </>
            )}

            {user.user.is_admin && (
              <>
                <Link href="/" className="text-white text-lg">
                  Personel Notes
                </Link>
                <Link href="/notes" className="text-white text-lg">
                  All Notes
                </Link>
                <Link href="/public-notes" className="text-white text-lg">
                  Public Notes
                </Link>
                <Link href="/private-notes" className="text-white text-lg">
                  Private Notes
                </Link>
                <Link href="/users" className="text-white text-lg">
                  Users
                </Link>
              </>
            )}
          </div>
        </div>

        <Profile />
      </div>
    </div>
  );
};

export default Sidebar;
