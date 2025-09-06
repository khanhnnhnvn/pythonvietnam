'use client';

import AuthButton from "@/components/auth/AuthButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

type UserData = {
  uid: string;
  email?: string;
  name?: string | null;
  avatar?: string;
  role?: string;
};

interface AdminHeaderProps {
  user: UserData;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <div className="block md:hidden">
          <SidebarTrigger />
       </div>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4"/>
            Trang chủ
          </Link>
        </Button>
        <AuthButton />
      </div>
    </header>
  );
}
