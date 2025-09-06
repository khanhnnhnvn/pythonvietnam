"use client";

import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { saveUser } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        const result = await saveUser({
            uid: user.uid,
            email: user.email ?? undefined,
            name: user.displayName,
            avatar: user.photoURL ?? undefined,
        });

        if (!result.success) {
            toast({
                variant: "destructive",
                title: "Lỗi lưu dữ liệu",
                description: result.error,
            });
        }
      }
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);

  const handleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged sẽ tự động xử lý việc cập nhật state và lưu user
    } catch(error) {
        console.error("Authentication error:", error);
        toast({
            variant: "destructive",
            title: "Đăng nhập thất bại",
            description: "Đã có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.",
        });
        setIsLoading(false);
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
        await signOut(auth);
        // onAuthStateChanged sẽ xử lý việc cập nhật user state thành null
    } catch (e) {
        toast({
            variant: "destructive",
            title: "Đăng xuất thất bại",
            description: "Đã có lỗi xảy ra trong quá trình đăng xuất.",
        });
    } finally {
      // setIsLoading sẽ được set thành false trong onAuthStateChanged
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <LoaderCircle className="animate-spin" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Button onClick={handleSignIn} size="sm">
        <LogIn className="mr-2 h-4 w-4" />
        Đăng nhập
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-9 w-9">
                <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? "User"} />
                <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.reload()} className="cursor-pointer">
          <span>Tải lại trang</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
