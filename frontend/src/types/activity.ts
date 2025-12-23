export type Activity = {
  id: number;
  name: string;
  description: string | null;
  category: string;
  date: string;
  durationMinutes: number;
};

export type CreateActivityRequest = {
    name: string;
    description?: string;
    category: string;
    date: string;
    durationMinutes: number;
};

export type UpdateActivityRequest = CreateActivityRequest;

export type ActivityFilters = {
    category?: string;
    from?: string;
    to?: string;
    q?: string;
    sort?: string[];
    page?: number;
    size?: number;
}

export type ActivityPage = {
  content: Activity[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
};