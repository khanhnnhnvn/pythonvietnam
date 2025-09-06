
import { blogCategories } from "@/lib/data";
import BlogPostCard from "@/components/blog/BlogPostCard";
import BlogCategoryFilter from "@/components/blog/BlogCategoryFilter";
import { getPosts } from "../actions";

export const metadata = {
  title: "Blog Công nghệ Python | Python Vietnam",
  description: "Khám phá blog công nghệ của cộng đồng Python Việt Nam. Các bài viết, hướng dẫn và chia sẻ kiến thức chuyên sâu về Python.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const category = searchParams.category;

  const blogPosts = await getPosts();

  const filteredPosts = category && category !== 'all'
    ? blogPosts.filter((post) => post.category === category)
    : blogPosts;
    
  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Blog Công nghệ</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Khám phá các bài viết, hướng dẫn và chia sẻ kiến thức về Python từ cộng đồng.
          Chọn một danh mục để bắt đầu.
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <BlogCategoryFilter />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
