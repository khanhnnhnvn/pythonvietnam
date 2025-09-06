
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, BookOpen, Briefcase, Menu, ShieldCheck, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserById } from "@/app/actions";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import AuthButton from "../auth/AuthButton";

type AppUser = {
  uid: string;
  email?: string;
  name?: string | null;
  avatar?: string;
  role?: string;
};


const navLinks = [
  { href: "/blog", label: "Bài viết", icon: BookOpen },
  { href: "/jobs", label: "Việc làm", icon: Briefcase },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const appUser = await getUserById(user.uid);
        setCurrentUser(appUser);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);


  const NavLink = ({ href, label, icon: Icon }: typeof navLinks[0]) => {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          pathname.startsWith(href)
            ? "bg-primary/10 text-primary"
            : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  }

  const showDashboardLink = currentUser?.role === 'admin' || currentUser?.role === 'employer';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link
          href="/"
          className="mr-6 flex items-center gap-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Code2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-foreground">Python Vietnam</span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
           {showDashboardLink && (
             <Link
                href="/admin"
                className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname.startsWith('/admin')
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                )}
                >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
            </Link>
          )}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <AuthButton user={currentUser}/>
        </div>
        <div className="flex flex-1 items-center justify-end md:hidden">
           <AuthButton user={currentUser}/>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Mở menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex h-full flex-col p-4">
                <Link
                  href="/"
                  className="mb-8 flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Code2 className="h-6 w-6 text-primary" />
                  <span className="font-bold text-foreground">Python Vietnam</span>
                </Link>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} />
                  ))}
                   {showDashboardLink && (
                    <Link
                        href="/admin"
                        className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            pathname.startsWith('/admin')
                                ? "bg-primary/10 text-primary"
                                : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                        >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
