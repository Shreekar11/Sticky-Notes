"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const auth =
      typeof window !== "undefined" ? !!localStorage.getItem("token") : "";

    useEffect(() => {
      if (auth) {
        return redirect("/");
      }
    }, [auth]);

    if (auth) {
      return <main className="bg-[#313338] h-screen"></main>;
    }

    return <Component {...props} />;
  };
}
