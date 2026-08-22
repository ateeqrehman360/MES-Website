export type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  featured: boolean;
  upcoming: boolean;
  ticketUrl?: string;
  attendance?: number;
};

// Event content will be added only from verified MES source material.
export const events: Event[] = [];
