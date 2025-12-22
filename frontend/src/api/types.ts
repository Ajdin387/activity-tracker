export type Activity = {
  id: number;
  name: string;
  description?: string;
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