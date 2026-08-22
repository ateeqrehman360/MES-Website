export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  organisation?: string;
  portrait?: string;
};

// Testimonials will remain empty until approved quotes are supplied.
export const testimonials: Testimonial[] = [];
