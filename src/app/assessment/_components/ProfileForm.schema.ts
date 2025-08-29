// src/app/assessment/_components/ProfileForm.schema.ts
import { z } from 'zod';

// Zod schema for validation, with all fields
export const profileSchema = z.object({
  // Assessment Details
  assessmentDate: z.string(),
  names: z.string().min(1, 'Assessor name is required.'),
  departments: z.string().min(1, 'Department is required.'),
  purpose: z.string().optional(),
  scope: z.string().optional(),
  assessmentType: z.string().optional(),
  assessmentStyle: z.string().optional(),

  // Organisation & SOC Profile
  businessFTE: z.string().optional(),
  sector: z.string().optional(),
  socYears: z.string().optional(),
  socFTE: z.string().optional(),
  socModel: z.string().optional(),
  socRegion: z.string().optional(),
  geoOps: z.string().optional(),

  // Target Maturity
  tgtMaturityBusiness: z.string().optional(),
  tgtMaturityPeople: z.string().optional(),
  tgtMaturityProcess: z.string().optional(),
  tgtMaturityTech: z.string().optional(),
  tgtMaturityServices: z.string().optional(),
  tgtMaturityOverall: z.string().optional(),

  // Target Capability
  tgtCapTech: z.string().optional(),
  tgtCapServices: z.string().optional(),
  tgtCapOverall: z.string().optional(),
  
  // Notes
  notes: z.string().optional(),
});

// We infer the TypeScript type directly from the Zod schema
export type ProfileFormData = z.infer<typeof profileSchema>;