import mysql from 'mysql2/promise';
import type { Connection } from 'mysql2/promise';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

async function testDbConnection() {
  let connection: Connection | undefined;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    // Nếu kết nối thành công, chúng ta không cần làm gì thêm ở đây.
    // Kết nối sẽ được đóng trong khối finally.
    return { success: true, message: 'Kết nối cơ sở dữ liệu MySQL thành công!' };
  } catch (error: any) {
    console.error('Lỗi kết nối CSDL:', error);
    return { success: false, message: `Kết nối thất bại: ${error.message}` };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export default async function DbTestPage() {
  const { success, message } = await testDbConnection();

  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className={`w-full max-w-md ${success ? 'border-green-500' : 'border-red-500'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-4 text-xl">
            {success ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-500" />
            )}
            Kiểm tra kết nối MySQL
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className={`text-lg ${success ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
          {!success && (
            <p className="mt-4 text-sm text-muted-foreground">
              Vui lòng kiểm tra lại thông tin đăng nhập trong tệp <code>.env</code> và đảm bảo máy chủ MySQL của bạn cho phép kết nối từ xa.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
