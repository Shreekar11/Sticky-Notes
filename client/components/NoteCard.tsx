import axios from "axios";
import { toast } from "sonner";
import { NoteData } from "@/type";
import { useAuth } from "@/context/Auth";
import { useEffect, useState } from "react";
import api, { baseURL } from "@/app/api/api";

// icons
import { IoIosMore } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";

// components
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ViewNoteDialog from "@/components/dialog/ViewNoteDialog";
import EditNoteDialog from "@/components/dialog/EditNoteDialog";

interface NotesProps {
  userNote: NoteData;
}

const NoteCard = ({ userNote }: NotesProps) => {
  const [notePrivacy, setNotePrivacy] = useState(userNote.privacy);
  const [note, setNote] = useState<NoteData[]>([]);
  const { authState: user } = useAuth();

  const getNote = async () => {
    try {
      const response = await api.get(`/note/get-note/${userNote.note_id}`);
      const data = await response.data.data;
      setNote(data);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    getNote();
  }, []);

  const handleChangePrivacy = async () => {
    const newPrivacy = notePrivacy === "public" ? "private" : "public";

    try {
      const response = await axios.put(
        `${baseURL}/note/edit-privacy/${userNote.note_id}`,
        { privacy: newPrivacy },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setNotePrivacy(newPrivacy);
      toast.success(response.data.message);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.log("Error: ", err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${baseURL}/note/delete-note/${userNote.note_id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success(response.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      toast.error(err.response.data.message);
      console.log("Error: ", err);
    }
  };

  const convertDate = (date: any) => {
    const localDate = new Date(date);
    const resultDate = localDate.toLocaleDateString();

    return resultDate;
  };

  return (
    <div className="">
      <Card className="w-full max-w-sm sm:max-w-lg bg-[#202123] border-[#202123] rounded-2xl">
        <CardHeader className="px-4">
          <div className="flex justify-between">
            <div className="flex flex-col justify-start items-start space-y-2">
              <CardTitle className="text-sm sm:text-lg text-white font-medium flex justify-center items-center gap-4">
                <>
                  {userNote.title.slice(0, 30)}
                  {userNote.title.length > 30 && "..."}
                </>
                {userNote.is_admin && (
                  <p className="text-xs sm:text-sm text-[#ffec5f]">
                    (admin note)
                  </p>
                )}
              </CardTitle>
              <CardTitle
                className="text-xs sm:text-sm text-zinc-500 text-start 
              font-medium flex justify-center items-center gap-2 sm:gap-4"
              >
                <div className="">{convertDate(userNote.created_at)}</div>
                <div className="text-xs sm:text-sm text-[#ffec5f]">
                  {userNote.privacy}
                </div>
              </CardTitle>
            </div>
            {userNote.fk_user === user.user.user_id || user.user.is_admin ? (
              <div className="flex justify-center items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button>
                      <IoIosMore className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[10rem] sm:w-[12rem] p-[0.5rem] sm:p-2 bg-[#202123] border-[#474b54] rounded-2xl text-white">
                    <div className="flex flex-col justify-center items-center">
                      <Button
                        onClick={handleChangePrivacy}
                        className="font-medium leading-none w-full rounded-xl hover:bg-[#17191b]"
                      >
                        Change to{" "}
                        {notePrivacy === "public" ? "private" : "public"}
                      </Button>

                      {/* view note dialog  */}
                      <div className="w-full">
                        <ViewNoteDialog note={note[0]} />
                      </div>

                      {/* edit note dialog */}
                      <div className="w-full">
                        <EditNoteDialog note={note[0]} />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button onClick={handleDelete}>
                  <IoTrashOutline className="h-4 w-4 sm:h-6 sm:w-6 text-red-500" />
                </Button>
              </div>
            ) : (
              <div className="text-white">
                <ViewNoteDialog note={note[0]} />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="text-xs sm:text-sm text-zinc-400">
          {userNote.content.slice(0, 50)}
          {userNote.content.length > 50 && "..."}
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteCard;
