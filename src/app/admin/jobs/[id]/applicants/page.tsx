
import { getJobById, getApplicationsByJobId, getUserById } from "@/app/actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getServerSideUser } from "@/lib/firebase-admin";

export default async function JobApplicantsPage({ params }: { params: { id: string } }) {
    const user = await getServerSideUser();
    if (!user) {
        redirect('/admin/jobs');
    }

    const id = Number(params.id);
    if (isNaN(id)) {
        notFound();
    }

    const job = await getJobById(id);
    if (!job) {
        notFound();
    }

    // Authorization check
    const appUser = await getUserById(user.uid);
    if (appUser?.role !== 'admin' && job.user_id !== user.uid) {
        redirect('/admin/jobs');
    }

    const applications = await getApplicationsByJobId(id);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                 <Button asChild variant="outline" size="icon">
                    <Link href="/admin/jobs">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                 </Button>
                 <div>
                    <p className="text-sm text-muted-foreground">Danh sách ứng viên cho vị trí</p>
                    <h1 className="text-2xl font-bold">{job.title}</h1>
                 </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tổng số ứng viên: {applications.length}</CardTitle>
                    <CardDescription>Danh sách các ứng viên đã nộp hồ sơ cho vị trí này.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Họ và tên</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead className="hidden sm:table-cell">Số điện thoại</TableHead>
                                <TableHead className="hidden sm:table-cell">Ngày nộp</TableHead>
                                <TableHead>CV</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.length > 0 ? (
                                applications.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-medium">{app.name}</TableCell>
                                        <TableCell className="hidden md:table-cell">{app.email}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{app.phone || 'N/A'}</TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {new Date(app.created_at).toLocaleDateString('vi-VN')}
                                        </TableCell>
                                        <TableCell>
                                            <Button asChild variant="outline" size="sm">
                                                <a href={app.cv_url} target="_blank" rel="noopener noreferrer">
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Xem CV
                                                </a>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Chưa có ứng viên nào.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
