export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
  content: string;
  imageUrl: string;
  imageHint: string;
  description: string;
}

export type JobCategory = 'Frontend' | 'Backend' | 'Full-stack' | 'DevOps' | 'Data Science' | 'Machine Learning';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Toàn thời gian' | 'Bán thời gian' | 'Hợp đồng';
  category: JobCategory;
  description: string;
  companyLogoUrl: string;
  companyLogoHint: string;
}
