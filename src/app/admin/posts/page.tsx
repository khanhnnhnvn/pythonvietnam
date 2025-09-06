
import Link from "next/link";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPosts, deletePost } from "@/app/actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Bài viết</CardTitle>
                <CardDescription>Quản lý tất cả các bài viết trên hệ thống.</CardDescription>
            </div>
            <Button asChild size="sm" className="gap-1">
                <Link href="/admin/posts/new">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Thêm bài viết
                    </span>
                </Link>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Ảnh</span>
              </TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="hidden md:table-cell">Tác giả</TableHead>
              <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
              <TableHead>
                <span className="sr-only">Hành động</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
                <TableRow key={post.id}>
                    <TableCell className="hidden sm:table-cell">
                        <img
                        alt={post.title}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={post.imageUrl ?? '/placeholder.svg'}
                        width="64"
                        />
                    </TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                    <TableCell className="hidden md:table-cell">{post.date}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/posts/edit/${post.id}`}>Sửa</Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem asChild>
                                <DeleteButton itemId={post.id} action={deletePost} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

    