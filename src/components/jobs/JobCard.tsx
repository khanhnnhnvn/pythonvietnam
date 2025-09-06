import Image from "next/image";
import Link from "next/link";
import type { Job } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Briefcase, Clock, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`} className="group block h-full">
      <Card className="flex h-full flex-col items-start gap-4 p-4 transition-all hover:shadow-md group-hover:border-primary/50 md:flex-row md:items-center md:p-6">
        <div className="relative h-16 w-16 flex-shrink-0">
          <Image
            src={job.companyLogoUrl}
            alt={`Logo của ${job.company}`}
            data-ai-hint={job.companyLogoHint}
            fill
            className="rounded-md object-contain"
          />
        </div>
        <div className="flex-1">
          <CardHeader className="p-0">
            <CardTitle className="text-lg group-hover:text-primary">{job.title}</CardTitle>
            <CardDescription className="text-base text-foreground">
              {job.company}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span>{job.category}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{job.type}</span>
              </div>
            </div>
          </CardContent>
        </div>
        <div className="ml-auto hidden w-full self-center md:block md:w-auto">
            <Button variant="ghost" className="text-primary group-hover:bg-accent/10">
                Xem chi tiết <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
        </div>
      </Card>
    </Link>
  );
}