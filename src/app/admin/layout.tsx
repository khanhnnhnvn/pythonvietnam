
'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { LoaderCircle } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'admin' && user.role !== 'employer'))) {
      redirect('/');
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col">
        <AdminHeader user={user} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
