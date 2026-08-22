export type RelationshipType = "partner" | "society" | "business";

export type Organisation = {
  name: string;
  logo: string;
  relationship: RelationshipType;
};

// Relationship labels must be verified before organisations are added.
export const organisations: Organisation[] = [];
