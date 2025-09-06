
'use client';

import * as React from "react";
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserById } from "@/app/actions";
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader } from "@/components/ui/sidebar";
import { BookText, Briefcase, LayoutDashboard, LoaderCircle } from "lucide-react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import type { User } from "firebase/auth";
import { Toaster } from "@/components/ui/toaster";

type AppUser = {
  uid: string;
  email?: string;
  name?: string | null;
  avatar?: string;
  role?: string;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<AppUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const appUser = await getUserById(firebaseUser.uid);
        // Allow both admin and regular users to access the admin area
        // Specific permissions will be handled on each page
        if (!appUser) {
             router.push('/');
        } else {
          setUser(appUser);
          setLoading(false);
        }
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Admin can see everything. Non-admins have restrictions handled on the pages.
   if (user.role !== 'admin') {
      const nonAdminAllowedPaths = ['/admin/jobs', '/admin/jobs/new'];
      const currentPath = window.location.pathname;
      const isAllowed = nonAdminAllowedPaths.some(path => currentPath.startsWith(path)) || currentPath === '/admin';
      
      if (!isAllowed && !currentPath.match(/^\/admin\/jobs\/\d+(\/edit|\/applicants)?$/)) {
          router.push('/admin/jobs');
          return (
             <div className="flex h-screen w-full items-center justify-center bg-background">
                <LoaderCircle className="h-8 w-8 animate-spin" />
                <p>Redirecting...</p>
             </div>
          );
      }
  }


  return (
    <html lang="vi">
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r">
              <SidebarContent>
                <SidebarHeader>
                  <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <h2 className="text-lg font-semibold">Dashboard</h2>
                  </div>
                </SidebarHeader>
                <SidebarMenu>
                  {user.role === 'admin' && (
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                        <Link href="/admin">
                            <LayoutDashboard />
                            Tổng quan
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {user.role === 'admin' && (
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                        <Link href="/admin/posts">
                            <BookText />
                            Bài viết
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin/jobs">
                        <Briefcase />
                        Việc làm
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <div className="flex-1 flex flex-col">
              <AdminHeader user={user} />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {/* Pass user to children */}
                {React.cloneElement(children as React.ReactElement, { user })}
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
