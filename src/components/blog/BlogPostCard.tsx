import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={post.imageUrl}
              alt={post.title}
              data-ai-hint={post.imageHint}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col p-4">
          <Badge variant="secondary" className="mb-2 w-fit">{post.category}</Badge>
          <CardTitle className="mb-2 text-lg font-bold leading-tight group-hover:text-primary">
            {post.title}
          </CardTitle>
          <p className="flex-1 text-sm text-muted-foreground">{post.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-sm font-medium text-primary">
          Đọc thêm <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </CardFooter>
      </Card>
    </Link>
  );
}
