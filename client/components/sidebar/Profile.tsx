import { useAuth } from "@/context/Auth";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import api from "@/app/api/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const { authState: session } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await api.post("/user/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success(response.data.message);
      router.push("/login");
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-baseline">
      <div className="flex p-2 justify-between">
        <div className="text-white text-sm sm:text-lg flex flex-col justify-center items-center space-y-2">
          <p>
            Hello,{" "}
            <span className="text-[#ffec5f]">{session?.user?.name!}</span>
          </p>
        </div>
      </div>
      <Button
        onClick={handleLogout}
        className="text-[#ffec5f] border-zinc-700 border p-6 w-full 
        rounded-xl mb-2 flex justify-center items-center gap-2"
      >
        Logout
      </Button>
    </div>
  );
};

export default Profile;
