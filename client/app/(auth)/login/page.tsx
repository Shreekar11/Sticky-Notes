"use client";

import { toast } from "sonner";
import { useState } from "react";
import { LoginForm } from "@/type";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

// components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import isAuth from "@/context/user/isAuth";

const baseURL = process.env.NEXT_PUBLIC_BASEURL;

const page = () => {
  const router = useRouter();
  const { setUserAuthInfo } = useAuth();
  const [userData, setUserData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    const email = userData.email;
    const password = userData.password;

    if (!email || !password) {
      toast.error("All fields required");
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/user/signin`, {
        email: userData.email,
        password: userData.password,
      });
      toast.success(response.data.message);
      setUserAuthInfo(response.data);
      console.log("response:", response);
      router.push("/");
    } catch (err: any) {
      toast.error(err.response.data.message);
      console.log("Error", err);
    }
  };

  return (
    <main className="bg-[#5d616a] flex justify-center items-center h-screen">
      <Card className="w-3/4 sm:w-1/3 py-2 lg:py-4 rounded-xl bg-[#3f4146] text-white border border-[#313338] flex justify-center items-center">
        <div className="">
          <CardHeader className="lg:mb-5 flex justify-center items-center ">
            <CardTitle className="mb-2">Login</CardTitle>
            <CardDescription className="text-sm text-center">
              Welcome back to{" "}
              <span className="text-[#ffec5f]">Sticky Notes</span>!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="lg:w-[25rem] grid items-center gap-4">
                <div className="flex flex-col space-y-2">
                  <div className="">
                    <Label htmlFor="name">Email Address</Label>
                    <Input
                      id="name"
                      type="email"
                      placeholder="Email Address"
                      className="mt-2 bg-[#3f4146] border border-gray-400 rounded-xl placeholder:text-gray-400"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="">
                    <Label htmlFor="name">Password</Label>
                    <Input
                      id="name"
                      type="password"
                      placeholder="Password"
                      className="mt-2 bg-[#3f4146] border border-gray-400 rounded-xl placeholder:text-gray-400"
                      value={userData.password}
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className=" flex flex-col space-y-2 justify-center items-center">
            <Button
              onClick={handleSubmit}
              className="w-full rounded-xl text-[#3f4146] bg-[#ffec5f] hover:bg-[#ffe627]"
            >
              Login
            </Button>
            <p className="text-xs">
              Don't have an account?{" "}
              <span className="text-[#ffec5f]">
                <Link href="/register">Register</Link>
              </span>
            </p>
          </CardFooter>
        </div>
      </Card>
    </main>
  );
};

export default isAuth(page);
