import { notFound } from "next/navigation";
import Image from "next/image";
import { blogPosts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import BlogPostSummary from "@/components/blog/BlogPostSummary";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) {
    return {
      title: "Không tìm thấy bài viết",
    };
  }
  return {
    title: `${post.title} | Python Vietnam`,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container max-w-4xl py-8 md:py-12">
      <div className="space-y-4 text-center">
        <Badge variant="secondary">{post.category}</Badge>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {post.title}
        </h1>
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
        </div>
      </div>
      <div className="relative my-8 h-64 w-full rounded-lg shadow-lg md:h-96">
        <Image
          src={post.imageUrl}
          alt={post.title}
          data-ai-hint={post.imageHint}
          fill
          className="rounded-lg object-cover"
          priority
        />
      </div>
      
      <BlogPostSummary blogPostContent={post.content} />

      <div
        className="mx-auto mt-8 max-w-none text-lg leading-relaxed text-foreground [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-primary [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_p]:mb-4 [&_a]:text-accent [&_a]:underline hover:[&_a]:no-underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-2 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-1 [&_code]:font-code [&_pre]:my-6 [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
