import { jobs } from "@/lib/data";
import JobCard from "@/components/jobs/JobCard";
import JobSearchFilters from "@/components/jobs/JobSearchFilters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileSearch } from "lucide-react";
import type { Job } from "@/lib/types";

export const metadata = {
  title: "Việc làm | Python Vietnam",
  description: "Tìm kiếm cơ hội việc làm trong ngành Python tại Việt Nam.",
};

export default function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams.q as string | undefined;
  const location = searchParams.location as string | undefined;
  const category = searchParams.category as Job["category"] | undefined;

  const filteredJobs = jobs.filter((job) => {
    const queryMatch =
      !query ||
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase());
    const locationMatch =
      !location || job.location.toLowerCase().includes(location.toLowerCase());
    const categoryMatch = !category || job.category === category;

    return queryMatch && locationMatch && categoryMatch;
  });

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Tìm kiếm Việc làm</h1>
        <p className="text-muted-foreground">
          Khám phá {jobs.length} cơ hội việc làm đang chờ bạn.
        </p>
      </div>
      <JobSearchFilters />
      <div className="mt-8">
        {filteredJobs.length > 0 ? (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <Alert className="mx-auto max-w-md">
             <FileSearch className="h-4 w-4" />
            <AlertTitle>Không tìm thấy kết quả</AlertTitle>
            <AlertDescription>
              Không có việc làm nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với từ khóa khác.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
