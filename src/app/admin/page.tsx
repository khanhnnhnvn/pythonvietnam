
'use client';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  BookMarked,
  Briefcase,
  Users
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
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import type { BlogPost, Job } from '@/lib/types';
import { LoaderCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const fetchData = async () => {
        if (user.role === 'admin') {
          const [postsData, jobsData] = await Promise.all([
            getPosts(),
            getJobs({ forAdminPage: true }),
          ]);
          setPosts(postsData);
          setJobs(jobsData);
        } else if (user.role === 'employer') {
          const jobsData = await getJobs({ userId: user.uid });
          setJobs(jobsData);
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const totalApplications = jobs.reduce((sum, job) => sum + (job.application_count || 0), 0);

  const renderAdminDashboard = () => (
    <>
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
    </>
  );
  
  const renderEmployerDashboard = () => (
     <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Việc làm đã đăng
          </CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{jobs.length}</div>
          <p className="text-xs text-muted-foreground">
            Tổng số việc làm bạn đã đăng
          </p>
           <Button asChild size="sm" className="mt-4">
              <Link href="/admin/my-jobs">Quản lý</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Lượt ứng tuyển
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalApplications}</div>
          <p className="text-xs text-muted-foreground">
            Tổng số hồ sơ đã ứng tuyển
          </p>
           <Button asChild size="sm" className="mt-4" variant="secondary">
              <Link href="/admin/my-jobs">Xem chi tiết</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          {user?.role === 'admin' ? 'Tổng quan về toàn bộ hệ thống.' : 'Tổng quan về các tin tuyển dụng của bạn.'}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        {user?.role === 'admin' ? renderAdminDashboard() : renderEmployerDashboard()}
      </div>
    </div>
  );
}
