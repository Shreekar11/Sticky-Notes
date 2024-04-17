"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { UserData } from "@/type";

export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const authString: string | null =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    const auth: UserData | null = authString ? JSON.parse(authString) : null;

    useEffect(() => {
      if (auth && auth.is_admin) {
        return redirect("/");
      }
    }, [auth]);

    if (auth) {
      return <main className="bg-[#313338] h-screen"></main>;
    }

    return <Component {...props} />;
  };
}
