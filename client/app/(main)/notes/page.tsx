"use client";

import api from "@/app/api/api";
import NoteCard from "@/components/NoteCard";
import { NoteData } from "@/type";
import { useEffect, useState } from "react";

const page = () => {
  const [publicNotes, setPublicNotes] = useState<NoteData[]>([]);

  const getPublicNotes = async () => {
    try {
      const response = await api.get("/note/get-public-notes");
      const data = await response.data.data;
      setPublicNotes(data);
      console.log(data);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    getPublicNotes();
  }, []);

  return (
    <main className="px-[2rem] sm:px-[5rem] mt-5 sm:mt-10 space-y-5 sm:space-y-10">
      <div className="text-[#ffec5f] font-bold text-2xl sm:text-4xl">
        Public Notes
      </div>
      <div className="flex flex-wrap gap-10">
        {publicNotes &&
          publicNotes.map((note, index) => (
            <NoteCard key={index} userNote={note} />
          ))}
      </div>
    </main>
  );
};

export default page;
