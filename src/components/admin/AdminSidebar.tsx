
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Code2, Home, Newspaper, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const navLinks = [
  { href: '/admin', label: 'Tổng quan', icon: Home },
  { href: '/admin/posts', label: 'Bài viết', icon: Newspaper },
  { href: '/admin/jobs', label: 'Việc làm', icon: Briefcase },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="">Admin Panel</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  {
                    'bg-muted text-primary': pathname === href,
                  }
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
           <Button size="sm" className="w-full" asChild>
                <Link href="/">Trở về trang chủ</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}

    