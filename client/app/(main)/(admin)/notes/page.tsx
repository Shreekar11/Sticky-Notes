"use client";

import { NoteData } from "@/type";
import { useEffect, useState } from "react";
import api from "@/app/api/api";
import isNotAuth from "@/context/admin/isNotAuth";

// components
import NoteCard from "@/components/NoteCard";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent } from "@/components/ui/pagination";

const page = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [allNotes, setAllNotes] = useState<NoteData[]>([]);

  const getAllNotes = async () => {
    try {
      const response = await api.get(
        `/admin/get-all-notes?page=${currentPage}&limit=${itemsPerPage}`
      );
      const data = await response.data.data;
      setAllNotes(data);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, [currentPage]);

  const handlePaginationClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="px-[2rem] sm:px-[5rem] mt-5 sm:mt-10 space-y-5 sm:space-y-10">
      <div className="text-[#ffec5f] font-bold text-2xl sm:text-3xl">
        All Notes
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
        {allNotes &&
          allNotes.map((note, index) => (
            <NoteCard key={index} userNote={note} />
          ))}
      </div>

      <Pagination>
        <Button
          disabled={currentPage === 1}
          className="text-md sm:text-lg"
          onClick={() => handlePaginationClick(currentPage - 1)}
        >
          Previous
        </Button>

        <PaginationContent className="text-white">
          {currentPage}
        </PaginationContent>

        <Button
          disabled={allNotes.length < 10}
          className="text-md sm:text-lg"
          onClick={() => handlePaginationClick(currentPage + 1)}
        >
          Next
        </Button>
      </Pagination>
    </main>
  );
};

export default isNotAuth(page);
