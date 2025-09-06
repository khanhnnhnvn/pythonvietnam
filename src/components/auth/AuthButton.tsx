
"use client";

import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { saveUser, getUserById } from "@/app/actions";
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

type AppUser = {
  uid: string;
  email?: string;
  name?: string | null;
  avatar?: string;
  role?: string;
};

interface AuthButtonProps {
    user?: AppUser | null;
}

export default function AuthButton({ user: initialUser }: AuthButtonProps) {
  const [user, setUser] = useState<AppUser | null | undefined>(initialUser);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      setIsLoading(true);
      if (firebaseUser) {
        const result = await saveUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? undefined,
            name: firebaseUser.displayName,
            avatar: firebaseUser.photoURL ?? undefined,
        });

        if (result.success) {
            const appUser = await getUserById(firebaseUser.uid);
            setUser(appUser);
        } else {
            toast({
                variant: "destructive",
                title: "Lỗi lưu dữ liệu",
                description: `Không thể lưu thông tin người dùng. Lỗi: ${result.error}`,
            });
            setUser(null); // Clear user if save fails
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);
  
   useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);


  const handleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
       // After sign-in, onAuthStateChanged will handle user state.
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
        // onAuthStateChanged will handle user state update to null
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
                <AvatarImage src={user.avatar ?? undefined} alt={user.name ?? "User"} />
                <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
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
