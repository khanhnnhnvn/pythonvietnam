
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import BlogPostSummary from "@/components/blog/BlogPostSummary";
import { getPostBySlug, getPosts } from "@/app/actions";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

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
            <time dateTime={new Date(post.created_at).toISOString()}>{post.date}</time>
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
        className="prose prose-lg mx-auto mt-8 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
