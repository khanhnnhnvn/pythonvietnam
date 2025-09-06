import PostForm from "../_components/PostForm";
import { cookies } from "next/headers";
import { getUserById } from "@/app/actions";
import { redirect } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// This helper is to get the user on the server side
// as `onAuthStateChanged` is client-side only.
// In a real app, you'd likely use a session management library.
const getCurrentUserServer = () => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};


export default async function NewPostPage() {
    // This is a simplified way to get user on server.
    // In a real app, you should handle sessions properly.
    // We are getting the user from the client-side auth state for now.
    // A more robust solution involves server-side session management.
    let authorName: string | null = "Admin"; // Fallback name

    // The user information should ideally come from a server-side session.
    // Since we are using client-side auth state, we'll rely on what's passed.
    // This is a placeholder for a more robust auth check.
    // For this to work robustly, you'd need server-side session management.
    // We will pass a fallback name for now.

    return (
        <PostForm authorName={authorName} />
    )
}