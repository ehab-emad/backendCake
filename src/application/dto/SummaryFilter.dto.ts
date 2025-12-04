import { z } from "zod";

export const _periods = [
  "current_week",
  "current_month",
  "past_month",
  "current_year",
  "past_year",
] as const;
export type SummaryPeriod = (typeof _periods)[number];

const periodSet = new Set<SummaryPeriod>(_periods);

export const SummaryFilterSchema = z.object({
  period: z.preprocess((val): SummaryPeriod => {
    if (typeof val === "string" && periodSet.has(val as SummaryPeriod)) {
      return val as SummaryPeriod;
    }
    return "current_month";
  }, z.enum(_periods)),
});

export type SummaryFilterDTO = z.infer<typeof SummaryFilterSchema>;
