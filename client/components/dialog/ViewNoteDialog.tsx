import { NoteData } from "@/type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface NotesProps {
  note: NoteData;
}
const ViewNoteDialog = ({ note }: NotesProps) => {

  const convertDate = (date: any) => {
    const localDate = new Date(date);
    const resultDate = localDate.toLocaleDateString();

    return resultDate;
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="hover:bg-[#17191b] w-full rounded-xl ">
            View Note
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-[20rem] sm:max-w-[425px] text-white rounded-xl md:rounded-xl border-[#202123] bg-[#202123]">
          <div className="grid gap-6 py-4">
            {note ? (
              <>
                <div className="flex flex-col justify-start items-start gap-2 sm:gap-3">
                  <DialogHeader className="mb-5">
                    <DialogTitle className="text-[#ffec5f]">{note.name}</DialogTitle>
                    <p className="text-xs sm:text-sm text-zinc-500">{convertDate(note.created_at)}</p>
                  </DialogHeader>
                  <Label
                    htmlFor="title"
                    className="text-right text-md sm:text-lg text-[#ffec5f]"
                  >
                    Title
                  </Label>
                  <div className="text-sm sm:text-md font-medium">
                    {note.title}
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
                    {note.content}
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
                    {note.privacy}
                  </div>
                </div>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewNoteDialog;
