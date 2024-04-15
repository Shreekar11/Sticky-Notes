"use client";

import { FaPlus } from "react-icons/fa6";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import api from "@/app/api/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [remaining, setRemaining] = useState(200);

  const handleCreateNote = async () => {
    console.log({
      title,
      content,
      privacy,
    });

    if (!title || !content || !privacy) {
      toast.error("All fields required");
      return;
    }

    if (content.length > 200) {
      toast.error("Note should be less than 200 words");
      return;
    }

    try {
      const response = await api.post("/note/create-note", {
        title,
        content,
        privacy,
      });
      toast.success(response.data.message);
      setTitle("");
      setContent("");
      setPrivacy("Select");
      router.push("/");
    } catch (err) {
      console.log("");
    }
  };

  const handlePrivacyChange = (value: string) => {
    setPrivacy(value);
  };

  return (
    <div className="p-2 flex flex-col h-screen">
      <div className="flex justify-center items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="text-[#ffec5f] border-zinc-700 border p-6 w-full 
        rounded-xl mb-2 flex justify-center items-center gap-2"
            >
              <FaPlus className="h-4 w-4" />
              <p>Create a Note</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[20rem] sm:max-w-[425px] text-white rounded-xl md:rounded-xl border-[#202123] bg-[#202123]">
            <DialogHeader>
              <DialogTitle className="text-[#ffec5f] text-2xl text-center">
                Create your note!
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
                onClick={handleCreateNote}
                className="text-[#202123] w-[17rem] sm:w-full rounded-xl bg-[#ffec5f] hover:bg-[#ffe627]"
              >
                Create Community
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Sidebar;
