export type ImpactStatistic = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
};

// No impact figures are included until MES verifies them.
export const impactStatistics: ImpactStatistic[] = [];
