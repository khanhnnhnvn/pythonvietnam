"use client";

import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createSession, clearSession } from "@/app/actions";
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

async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    const response = await createSession(idToken);
    if (!response.success) {
        throw new Error('Failed to create session');
    }
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
}

async function signOut() {
    await auth.signOut();
    await clearSession();
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
        await signInWithGoogle();
        // The onAuthStateChanged listener will handle the user state update
    } catch(e) {
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
        await signOut();
    } catch (e) {
        toast({
            variant: "destructive",
            title: "Đăng xuất thất bại",
            description: "Đã có lỗi xảy ra trong quá trình đăng xuất.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-10 w-10 items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button onClick={handleSignIn}>
        <LogIn className="mr-2" />
        Đăng nhập
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
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
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}