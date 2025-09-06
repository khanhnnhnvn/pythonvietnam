import Image from "next/image";
import type { Job } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Briefcase, Clock } from "lucide-react";
import { Button } from "../ui/button";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card className="flex flex-col items-start gap-4 p-4 transition-all hover:shadow-md md:flex-row md:items-center md:p-6">
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
          <CardTitle className="text-lg">{job.title}</CardTitle>
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
      <div className="ml-auto w-full self-center md:w-auto">
        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 md:w-auto">Nộp đơn</Button>
      </div>
    </Card>
  );
}
