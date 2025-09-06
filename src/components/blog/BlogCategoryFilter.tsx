"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { blogCategories } from "@/lib/data";

export default function BlogCategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-xs">
        <Select onValueChange={handleCategoryChange} value={currentCategory ?? "all"}>
            <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {blogCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                        {category}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
  );
}
