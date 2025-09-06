
import EmployerRegistrationForm from "@/components/auth/EmployerRegistrationForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = {
    title: "Đăng ký Nhà tuyển dụng | Python Vietnam",
    description: "Đăng ký để trở thành nhà tuyển dụng và bắt đầu đăng tin tuyển dụng trên Python Vietnam.",
};

export default function RegisterEmployerPage() {
    return (
        <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Đăng ký trở thành Nhà tuyển dụng</CardTitle>
                    <CardDescription>
                        Điền vào biểu mẫu bên dưới để gửi yêu cầu. Chúng tôi sẽ xem xét và phê duyệt tài khoản của bạn trong thời gian sớm nhất.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EmployerRegistrationForm />
                </CardContent>
            </Card>
        </div>
    );
}
