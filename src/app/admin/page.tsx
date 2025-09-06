
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookText, Briefcase } from "lucide-react";
import Link from "next/link";
import { getPosts, getJobs } from "@/app/actions";
import { redirect } from "next/navigation";

type AppUser = {
  uid: string;
  email?: string;
  name?: string | null;
  avatar?: string;
  role?: string;
};

interface AdminDashboardPageProps {
  user?: AppUser;
}

export default async function AdminDashboardPage({ user }: AdminDashboardPageProps) {
  // If user is not admin, redirect them to the jobs page.
  if (user?.role !== 'admin') {
    redirect('/');
  }

  const posts = await getPosts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chào mừng đến trang Quản trị</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/admin/posts">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quản lý Bài viết</CardTitle>
              <BookText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
              <p className="text-xs text-muted-foreground">Tổng số bài viết</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
