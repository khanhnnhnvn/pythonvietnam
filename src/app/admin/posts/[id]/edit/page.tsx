import PostForm from "../../_components/PostForm";
import { getPostById } from "@/app/actions";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: { id: string }}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        notFound();
    }

    const post = await getPostById(id);

    if (!post) {
        notFound();
    }
    
    return <PostForm post={post} />
}
