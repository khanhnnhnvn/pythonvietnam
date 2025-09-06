
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getPostById } from "@/app/actions";

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id, 10);
    if (isNaN(id)) {
        notFound();
    }

    const post = await getPostById(id);

    if (!post) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chỉnh sửa bài viết</CardTitle>
                <CardDescription>Cập nhật thông tin cho bài viết của bạn.</CardDescription>
            </CardHeader>
            <CardContent>
                <PostForm post={post} />
            </CardContent>
        </Card>
    )
}

    