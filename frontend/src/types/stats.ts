export type StatsQuery = {
  categories?: string[];
  from?: string;
  to?: string;
};

export type StatsTotalResponse = {
  totalMinutes: number;
};

export type StatsByDayResponse = {
  date: string;
  totalMinutes: number;
};

export type StatsByCategoryResponse = {
  category: string;
  totalMinutes: number;
};

export type StatsByDayCategoryResponse = {
  date: string;
  category: string;
  totalMinutes: number;
};
