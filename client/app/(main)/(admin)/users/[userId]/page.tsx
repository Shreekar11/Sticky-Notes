"use client";

import api from "@/app/api/api";
import NoteCard from "@/components/NoteCard";
import isNotAuth from "@/context/admin/isNotAuth";
import { NoteData } from "@/type";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const User = () => {
  const params = useParams();
  const userId = params.userId;

  const [userNotes, setUserNotes] = useState<NoteData[]>([]);
  const getUserNotes = async () => {
    try {
      const response = await api.get(`/admin/get-users-notes/${userId}`);
      const data = await response.data.data;
      setUserNotes(data);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    getUserNotes();
  }, []);

  return (
    <main className="px-[2rem] sm:px-[5rem] mt-5 sm:mt-10 space-y-5 sm:space-y-10">
      {userNotes.length > 0 && (
        <div className="text-[#ffec5f] font-bold text-2xl sm:text-3xl">
          {userNotes[0].username} Notes
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
        {userNotes.length > 0 &&
          userNotes.map((note, index) => (
            <NoteCard key={index} userNote={note} />
          ))}
      </div>
    </main>
  );
};

export default isNotAuth(User);
