"use client";

import { NoteData } from "@/type";
import { useAuth } from "@/context/Auth";
import { useEffect, useState } from "react";
import api from "@/app/api/api";
import isNotAuth from "@/context/user/isNotAuth";

// components
import NoteCard from "@/components/NoteCard";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const PublicNotes = () => {
  const { authState: user } = useAuth();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [publicNotes, setPublicNotes] = useState<NoteData[]>([]);

  const getPublicNotes = async () => {
    try {
      const response = await api.get(
        `/note/get-public-notes?page=${currentPage}&limit=${itemsPerPage}`
      );
      const data = await response.data.data;
      const filterAdminNotes = data.filter((note: NoteData) => !note.is_admin);
      setPublicNotes(filterAdminNotes);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    getPublicNotes();
  }, [user]);

  const handlePaginationClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="px-[2rem] sm:px-[5rem] mt-5 sm:mt-10 space-y-5 sm:space-y-10">
      <div className="text-[#ffec5f] font-bold text-2xl sm:text-3xl">
        Public Notes
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
        {publicNotes.length > 0 ? (
          publicNotes.map((note, index) => (
            <NoteCard key={index} userNote={note} />
          ))
        ) : (
          <div className="flex items-center rounded-xl bg-[#202123] p-2 sm:p-5">
            <div className="space-y-8">
              <div className="space-y-2">
                <Skeleton className="h-3 sm:h-4 w-[250px] bg-[#4e4e51] rounded-xl" />
                <div className="flex gap-2">
                  <Skeleton className="h-3 sm:h-4 w-[100px] bg-[#4e4e51] rounded-xl" />
                  <Skeleton className="h-3 sm:h-4 w-[80px] bg-[#4e4e51] rounded-xl" />
                </div>
              </div>
              <Skeleton className="h-3 sm:h-4 w-[250px] bg-[#4e4e51] rounded-xl" />
            </div>
          </div>
        )}
      </div>

      <Pagination>
        <Button
          disabled={currentPage === 1}
          className="text-md sm:text-lg text-[#ffec5f]"
          onClick={() => handlePaginationClick(currentPage - 1)}
        >
          Previous
        </Button>

        <PaginationContent className="text-white">
          {currentPage}
        </PaginationContent>

        <Button
          disabled={publicNotes.length < 10}
          className="text-md sm:text-lg text-[#ffec5f]"
          onClick={() => handlePaginationClick(currentPage + 1)}
        >
          Next
        </Button>
      </Pagination>
    </main>
  );
};

export default isNotAuth(PublicNotes);
