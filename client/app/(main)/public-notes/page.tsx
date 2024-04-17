"use client";

import { NoteData } from "@/type";
import { useAuth } from "@/context/Auth";
import { useEffect, useState } from "react";
import api from "@/app/api/api";
import NoteCard from "@/components/NoteCard";
import isNotAuth from "@/context/user/isNotAuth";

const page = () => {
  const { authState: user } = useAuth();
  const [publicNotes, setPublicNotes] = useState<NoteData[]>([]);

  const getPublicNotes = async () => {
    try {
      const response = await api.get("/note/get-public-notes");
      const data = await response.data.data;
      const filteredNotes = data.filter(
        (note: NoteData) =>
          note.fk_user !== user.user.user_id
      );

      const filterAdminNotes = filteredNotes.filter((note: NoteData) => (
        !note.is_admin
      ))
      setPublicNotes(filterAdminNotes);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    getPublicNotes();
  }, [user]);

  console.log(publicNotes);

  return (
    <main className="px-[2rem] sm:px-[5rem] mt-5 sm:mt-10 space-y-5 sm:space-y-10">
      <div className="text-[#ffec5f] font-bold text-2xl sm:text-3xl">
        Public Notes
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
        {publicNotes.length > 0 &&
          publicNotes.map((note, index) => (
            <NoteCard key={index} userNote={note} />
          ))}
      </div>
    </main>
  );
};

export default isNotAuth(page);
