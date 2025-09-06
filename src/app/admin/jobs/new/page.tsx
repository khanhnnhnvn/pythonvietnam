
import JobForm from "@/components/admin/JobForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewJobPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Đăng tin tuyển dụng mới</CardTitle>
                <CardDescription>Điền vào biểu mẫu bên dưới để tạo một tin tuyển dụng.</CardDescription>
            </CardHeader>
            <CardContent>
                <JobForm />
            </CardContent>
        </Card>
    )
}

    