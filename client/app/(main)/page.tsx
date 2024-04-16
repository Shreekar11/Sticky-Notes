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
      {usersNotes.length > 0 && (
        <div className="text-[#ffec5f] font-bold text-2xl sm:text-4xl">
          Personel Notes
        </div>
      )}

      {usersNotes.length === 0 && (
        <div className="flex justify-center items-center h-[60vh] text-[#ffec5f] font-semibold text-4xl">
          Create your first note!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
        {usersNotes.length > 0 &&
          usersNotes.map((note, index) => (
            <NoteCard key={index} userNote={note} />
          ))}
      </div>
    </main>
  );
};

export default Home;
