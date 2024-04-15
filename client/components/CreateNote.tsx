import { FaPlus } from "react-icons/fa6";

const CreateNote = () => {
  const createNote = async () => {
    try {
    } catch (err) {
      console.log("");
    }
  };

  return (
    <div className="border-gray-700 border chatRow mb-2">
      <FaPlus className="h-4 w-4" />
      <p>New Chat</p>
    </div>
  );
};

export default CreateNote;
