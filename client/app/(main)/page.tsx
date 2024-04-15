"use client";

import { NoteData } from "@/type";
import { useEffect, useState } from "react";
import api from "@/app/api/api";
import NoteCard from "@/components/NoteCard";

const Home = () => {
  const [usersNotes, setUserNotes] = useState<NoteData[]>([]);
  const getAllUserNotes = async () => {
    try {
      const response = await api.get("/note/get-user-notes");
      const data = await response.data.data;
      setUserNotes(data);
    } catch (err: any) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    getAllUserNotes();
  }, []);

  return (
    <main className="px-[2rem] sm:px-[5rem] mt-5 sm:mt-10 space-y-5 sm:space-y-10">
      <div className="text-[#ffec5f] font-bold text-2xl sm:text-4xl">
        My Notes
      </div>
      <div className="flex flex-wrap gap-10">
        {usersNotes &&
          usersNotes.map((note, index) => (
            <NoteCard key={index} userNote={note} />
          ))}
      </div>
    </main>
  );
};

export default Home;
