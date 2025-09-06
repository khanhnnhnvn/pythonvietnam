
import { notFound } from "next/navigation";
import JobForm from "@/components/admin/JobForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getJobById } from "@/app/actions";

export default async function EditJobPage({ params }: { params: { id: string } }) {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id, 10);
    if (isNaN(id)) {
        notFound();
    }

    const job = await getJobById(id);

    if (!job) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chỉnh sửa tin tuyển dụng</CardTitle>
                <CardDescription>Cập nhật thông tin cho tin tuyển dụng của bạn.</CardDescription>
            </CardHeader>
            <CardContent>
                <JobForm job={job} />
            </CardContent>
        </Card>
    )
}

    