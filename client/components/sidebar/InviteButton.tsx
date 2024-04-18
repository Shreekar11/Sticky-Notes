import { useState } from "react";
import { toast } from "sonner";

// components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const InviteButton = () => {
  const [inviteLink, setInviteLink] = useState("https://sticky-notes-liart.vercel.app/");

  const handleCopy = async () => {
    try {
      const response = await navigator.clipboard.writeText(inviteLink);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
      console.log("Error: ", err);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="text-[#ffec5f] border-zinc-700 border p-6 w-full 
        rounded-xl mb-2 flex justify-center items-center gap-2"
          >
            <p>Invite Link</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[20rem] sm:max-w-[425px] text-white rounded-xl md:rounded-xl border-[#202123] bg-[#202123]">
          <Label htmlFor="link" className="">
            Invite Link
          </Label>
          <div className="flex flex-col sm:flex-row justify-center sm:items-center gap-2">
            <Input
              id="link"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              className="col-span-3 w-[17rem] sm:w-full border pl-2 border-zinc-500 rounded-xl placeholder:text-zinc-500"
            />
            <Button
              onClick={handleCopy}
              className="bg-black rounded-xl hover:bg-black"
            >
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InviteButton;
