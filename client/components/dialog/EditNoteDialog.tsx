import { NoteData } from "@/type";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import axios from "axios";
import { baseURL } from "@/app/api/api";
import { toast } from "sonner";
import { useAuth } from "@/context/Auth";

interface NoteProps {
  note: NoteData;
}

const EditNoteDialog = ({ note }: NoteProps) => {
  const { authState: data } = useAuth();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [privacy, setPrivacy] = useState(note.privacy);
  const [remaining, setRemaining] = useState(200);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setPrivacy(note.privacy);
  }, [note]);

  const handlePrivacyChange = (value: string) => {
    setPrivacy(value);
  };

  const handleEditNote = async () => {
    if (!title || !content || !privacy) {
      toast.error("All fields required");
      return;
    }

    if (content.length > 200) {
      toast.error("Note should be less than 200 words");
      return;
    }

    try {
      const response = await axios.put(
        `${baseURL}/note/edit-note/${note.note_id}`,
        {
          title,
          content,
          privacy,
        },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );
      toast.success(response.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      console.log("response: ", response);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="hover:bg-[#17191b] w-full rounded-xl ">
            Edit Note
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[20rem] sm:max-w-[425px] text-white rounded-xl md:rounded-xl border-[#202123] bg-[#202123]">
          <DialogHeader>
            <DialogTitle className="text-[#ffec5f] text-2xl text-center">
              Edit note!
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col justify-start items-start gap-2 sm:gap-3">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3 w-[17rem] sm:w-full border pl-2 border-zinc-500 rounded-xl placeholder:text-zinc-500"
              />
            </div>
            <div className="flex flex-col justify-start items-start gap-2 sm:gap-3">
              <div className="flex gap-[5rem] sm:gap-[11.8rem] justify-center items-center">
                <Label htmlFor="content" className="text-right">
                  Content
                </Label>
                <h1
                  className={`text-xs ${
                    remaining - content.length <= 50
                      ? "text-[#ffec5f]"
                      : "text-[#fff]"
                  }`}
                >
                  {remaining - content.length} words remaining
                </h1>
              </div>
              <textarea
                id="content"
                placeholder="Enter content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3 w-[17rem] sm:w-full pl-2 border bg-transparent border-zinc-500 rounded-xl placeholder:text-zinc-500"
              />
            </div>
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <Label htmlFor="privacy">Privacy</Label>
              <div className="py-2">{note.privacy}</div>
              <Select onValueChange={handlePrivacyChange}>
                <SelectTrigger
                  className="rounded-xl w-[17rem] sm:w-full text-zinc-300"
                  id="privacy"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent
                  className="text-white rounded-xl bg-[#202123]"
                  position="popper"
                >
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleEditNote}
              className="text-[#202123] w-[17rem] sm:w-full rounded-xl bg-[#ffec5f] hover:bg-[#ffe627]"
            >
              Edit Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditNoteDialog;
