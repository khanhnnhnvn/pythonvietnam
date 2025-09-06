
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  BookMarked,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPosts, getJobs } from '../actions';

export default async function AdminDashboardPage() {
  const posts = await getPosts();
  const jobs = await getJobs(true);

  return (
    <div>
       <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan về trang web của bạn.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quản lý Bài viết
            </CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số bài viết trên hệ thống
            </p>
             <Button asChild size="sm" className="mt-4">
                <Link href="/admin/posts">Quản lý</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quản lý Việc làm
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số việc làm trên hệ thống
            </p>
             <Button asChild size="sm" className="mt-4">
                <Link href="/admin/jobs">Quản lý</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
    
