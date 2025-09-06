"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { jobCategories } from "@/lib/data";
import { Card, CardContent } from "../ui/card";

export default function JobSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;
    const location = formData.get("location") as string;
    const category = formData.get("category") as string;
    
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    if (category && category !== "all") params.set("category", category);

    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <label htmlFor="query" className="mb-2 block text-sm font-medium">
              Từ khóa
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="query"
                name="query"
                placeholder="Vị trí, công ty..."
                defaultValue={searchParams.get("q") ?? ""}
                className="pl-10"
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <label htmlFor="location" className="mb-2 block text-sm font-medium">
              Địa điểm
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                name="location"
                placeholder="Thành phố, quốc gia..."
                defaultValue={searchParams.get("location") ?? ""}
                className="pl-10"
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <label htmlFor="category" className="mb-2 block text-sm font-medium">
              Danh mục
            </label>
            <Select
              name="category"
              defaultValue={searchParams.get("category") ?? "all"}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {jobCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
