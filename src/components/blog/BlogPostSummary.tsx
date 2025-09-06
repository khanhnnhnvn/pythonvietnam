"use client";

import { useState } from "react";
import { Sparkles, LoaderCircle } from "lucide-react";
import { summarizeBlogPost } from "@/ai/flows/summarize-blog-post";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface BlogPostSummaryProps {
  blogPostContent: string;
}

export default function BlogPostSummary({ blogPostContent }: BlogPostSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeBlogPost({ blogPostContent });
      setSummary(result.summary);
    } catch (error) {
      console.error("Failed to summarize blog post:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo tóm tắt. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-8">
      {!summary && !isLoading && (
        <div className="flex justify-center">
            <Button onClick={handleSummarize} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Sparkles className="mr-2 h-4 w-4" />
                Tóm tắt với AI
            </Button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            <span>AI đang tạo tóm tắt...</span>
        </div>
      )}

      {summary && (
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Sparkles className="h-5 w-5" />
              Tóm tắt bằng AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
