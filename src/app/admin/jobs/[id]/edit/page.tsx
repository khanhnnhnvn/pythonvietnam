import JobForm from "../../_components/JobForm";
import { getJobById } from "@/app/actions";
import { notFound } from "next/navigation";

export default async function EditJobPage({ params }: { params: { id: string }}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        notFound();
    }

    const job = await getJobById(id);

    if (!job) {
        notFound();
    }
    
    return <JobForm job={job} />
}
