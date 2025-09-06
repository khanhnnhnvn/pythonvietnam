
import PostForm from "@/components/admin/PostForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewPostPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Thêm bài viết mới</CardTitle>
                <CardDescription>Điền vào biểu mẫu bên dưới để tạo một bài viết mới.</CardDescription>
            </CardHeader>
            <CardContent>
                <PostForm />
            </CardContent>
        </Card>
    )
}

    