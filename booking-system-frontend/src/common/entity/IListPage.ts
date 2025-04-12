import { z } from 'zod';

export const IListPageZod = z.object({
  currentPage: z.number(),
  rowPerPage: z.number(),
  sortBy: z.string(),
  sortCriteria: z
    .array(z.object({ sortBy: z.string(), sortOrder: z.string() }))
    .optional(),
  sortOrder: z.string(),
  globalSearch: z.string(),
  total_records: z.number().optional(),
});

export type IListPage = z.infer<typeof IListPageZod>;
