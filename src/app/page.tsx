
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import BlogPostCard from "@/components/blog/BlogPostCard";
import JobCard from "@/components/jobs/JobCard";
import { getPosts, getJobs } from "./actions";

export default async function Home() {
  const allPosts = await getPosts();
  const allJobs = await getJobs();
  const latestPosts = allPosts.slice(0, 3);
  const featuredJobs = allJobs.slice(0, 4);

  return (
    <div className="flex flex-col">
      <section className="relative w-full bg-primary/10 py-8 md:py-12">
        <div className="container text-center">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src="https://picsum.photos/1920/1080"
              alt="Hình nền trừu tượng"
              data-ai-hint="abstract code"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
              Cộng đồng Python Việt Nam
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg text-foreground/80 md:text-xl">
              Nơi kết nối, chia sẻ kiến thức và tìm kiếm cơ hội việc làm Python. Khám phá blog công nghệ và tham gia cùng hàng ngàn lập trình viên.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/blog">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Khám phá Blog
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/jobs">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Tìm việc làm Python
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Blog Công nghệ Mới nhất</h2>
          <p className="mt-2 max-w-[600px] text-foreground/70">
            Cập nhật những bài viết, hướng dẫn và chia sẻ mới nhất từ cộng đồng Python Việt Nam.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/blog">
              Xem tất cả bài viết <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="w-full bg-primary/10 py-8 md:py-12">
        <div className="container">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Việc làm Python Nổi bật</h2>
            <p className="mt-2 max-w-[600px] text-foreground/70">
              Những vị trí đang tuyển dụng hấp dẫn trong hệ sinh thái Python dành cho bạn.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link href="/jobs">
                Xem tất cả việc làm <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
