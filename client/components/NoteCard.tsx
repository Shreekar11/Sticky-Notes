import { NoteData } from "@/type";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { IoIosMore } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";
import { IoTrashOutline } from "react-icons/io5";
import api, { baseURL } from "@/app/api/api";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import ViewNoteDialog from "./dialog/ViewNoteDialog";

interface NotesProps {
  userNote: NoteData;
}

const NoteCard = ({ userNote }: NotesProps) => {
  const token = localStorage.getItem("token");
  const [notePrivacy, setNotePrivacy] = useState(userNote.privacy);
  const [note, setNote] = useState<NoteData[]>([]);

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
    console.log(newPrivacy);
    try {
      const response = await axios.put(
        `${baseURL}/note/edit-privacy/${userNote.note_id}`,
        { privacy: newPrivacy },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotePrivacy(newPrivacy);
      console.log("edit response: ", response);
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
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
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
      <Card className="w-full max-w-sm sm:max-w-md bg-[#202123] border-[#202123] rounded-2xl">
        <CardHeader className="px-4">
          <div className="flex justify-between">
            <div className="flex flex-col justify-start items-start space-y-2">
              <CardTitle className="text-sm sm:text-lg text-white font-medium">
                {userNote.title.slice(0, 25)}...
              </CardTitle>
              <CardTitle
                className="text-xs sm:text-sm text-zinc-500 text-start 
              font-medium flex justify-center items-center gap-2 sm:gap-4"
              >
                <div className="">{convertDate(userNote.created_at)}</div>
                <div className="flex justify-center items-center gap-2">
                  <LuRefreshCcw className="h-2 w-2 sm:h-4 sm:w-4" />{" "}
                  {convertDate(userNote.updated_at)}
                </div>
              </CardTitle>
            </div>
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
                    <ViewNoteDialog note={note[0]} />

                    {/* <Dialog>
                      <DialogTrigger asChild>
                        <Button className="hover:bg-[#17191b] w-full rounded-xl ">
                          View Note
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-[20rem] sm:max-w-[425px] text-white rounded-xl md:rounded-xl border-[#202123] bg-[#202123]">
                        <div className="grid gap-6 py-4">
                          {note.length > 0 ? (
                            <>
                              <div className="flex flex-col justify-start items-start gap-2 sm:gap-3">
                                <Label
                                  htmlFor="title"
                                  className="text-right text-md sm:text-lg text-[#ffec5f]"
                                >
                                  Title
                                </Label>
                                <div className="text-sm sm:text-md font-medium">
                                  {note[0].title}
                                </div>
                              </div>
                              <div className="flex flex-col justify-start items-start gap-2 sm:gap-3">
                                <Label
                                  htmlFor="content"
                                  className="text-right text-md sm:text-lg text-[#ffec5f]"
                                >
                                  Content
                                </Label>
                                <div className="text-sm sm:text-md font-medium">
                                  {note[0].content}
                                </div>
                              </div>
                              <div className="flex flex-col justify-start items-start gap-2 sm:gap-3">
                                <Label
                                  htmlFor="privacy"
                                  className="text-right text-md sm:text-lg text-[#ffec5f]"
                                >
                                  Privacy
                                </Label>
                                <div className="text-sm sm:text-md font-medium">
                                  {note[0].privacy}
                                </div>
                              </div>
                            </>
                          ) : (
                            <p>Loading...</p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog> */}
                  </div>
                </PopoverContent>
              </Popover>
              <Button onClick={handleDelete}>
                <IoTrashOutline className="h-4 w-4 sm:h-6 sm:w-6 text-red-500" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-xs sm:text-sm text-zinc-400">
          {userNote.content.slice(0, 50)}...
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteCard;
