"use client";

import { toast } from "sonner";
import { UserData } from "@/type";
import { useEffect, useState } from "react";
import axios from "axios";
import api, { baseURL } from "@/app/api/api";

// components
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  const getAllUsers = async () => {
    try {
      const response = await api.get("/admin/get-all-users");
      const data = await response.data.data;
      setUsers(data);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleChangeRole = async (userId: any) => {
    try {
      const response = await axios.put(
        `${baseURL}/admin/role-change/${userId}`
      );
      toast.success(response.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return (
    <div className=" rounded-2xl m-10">
      <Table className="text-white bg-[#202123] rounded-2xl">
        <TableHeader>
          <TableRow className="text-[#ffec5f]">
            <TableHead className="w-[100px]">User Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Change Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 &&
            users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell className="font-medium">{user.user_id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="">
                  {user.is_admin ? "Admin" : "User"}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleChangeRole(user.user_id)}
                    className="bg-black rounded-xl hover:bg-black"
                  >
                    {user.is_admin ? "Make user" : "Make admin"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
