
import JobForm from "../_components/JobForm";
import { getServerSideUser } from "@/lib/firebase-admin";
import { redirect } from 'next/navigation';

export default async function NewJobPage() {
    const user = await getServerSideUser();

    if (!user) {
        // Redirect to login or home page if not authenticated
        redirect('/');
    }
    
    return <JobForm userId={user.uid} />
}
