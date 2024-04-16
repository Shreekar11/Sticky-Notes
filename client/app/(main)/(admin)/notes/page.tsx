"use client";

import { NoteData } from "@/type";
import { useEffect, useState } from "react";
import api from "@/app/api/api";
import NoteCard from "@/components/NoteCard";

const page = () => {
  const [allNotes, setAllNotes] = useState<NoteData[]>([]);
  const getAllNotes = async () => {
    try {
      const response = await api.get("/admin/get-all-notes");
      const data = await response.data.data;
      setAllNotes(data);
      console.log(data);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  return (
    <main className="px-[2rem] sm:px-[5rem] mt-5 sm:mt-10 space-y-5 sm:space-y-10">
      <div className="text-[#ffec5f] font-bold text-2xl sm:text-4xl">
        All Notes
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
        {allNotes &&
          allNotes.map((note, index) => (
            <NoteCard key={index} userNote={note} />
          ))}
      </div>
    </main>
  );
};

export default page;
