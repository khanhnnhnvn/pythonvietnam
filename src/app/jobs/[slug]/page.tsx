import { getJobBySlug, getJobs } from "@/app/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
    const jobs = await getJobs();
    return jobs.map((job) => ({
      slug: job.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const job = await getJobBySlug(params.slug);
  if (!job) {
    return {
      title: "Không tìm thấy việc làm",
    };
  }
  return {
    title: `${job.title} tại ${job.company} | Python Vietnam`,
    description: job.description.substring(0, 160),
  };
}


export default async function JobDetailPage({ params }: { params: { slug: string }}) {
    const job = await getJobBySlug(params.slug);

    if (!job) {
        notFound();
    }

    return (
        <div className="container max-w-4xl py-8 md:py-12">
            <Card>
                <CardHeader className="flex flex-col items-start gap-4 md:flex-row">
                    <div className="relative h-24 w-24 flex-shrink-0">
                        <Image
                        src={job.companyLogoUrl}
                        alt={`Logo của ${job.company}`}
                        data-ai-hint={job.companyLogoHint}
                        fill
                        className="rounded-md border object-contain p-1"
                        />
                    </div>
                    <div className="flex-1">
                        <Badge variant="secondary" className="mb-2">{job.category}</Badge>
                        <CardTitle className="text-2xl md:text-3xl">{job.title}</CardTitle>
                        <CardDescription className="mt-1 text-lg text-foreground">{job.company}</CardDescription>
                         <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Briefcase className="h-4 w-4" />
                                <span>{job.type}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full shrink-0 md:w-auto">
                        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 md:w-auto">Nộp đơn ngay</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-primary">Mô tả công việc</h2>
                        <div className="whitespace-pre-line text-foreground">
                            {job.description}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
