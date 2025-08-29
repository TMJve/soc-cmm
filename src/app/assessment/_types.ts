// src/app/assessment/_types.ts
import { z } from "zod";

// Business Drivers
const businessDriversSchema = z.object({
  identified: z.string().min(1, "Required"),
  documented: z.string().min(1, "Required"),
  decisionMaking: z.string().min(1, "Required"),
  serviceCatalogueAlignment: z.string().min(1, "Required"),
  stakeholderValidation: z.string().min(1, "Required"),
});

// Customer Types
const customerTypesSchema = z.object({
  Legal: z.boolean(),
  Audit: z.boolean(),
  EngineeringRND: z.boolean(),
  IT: z.boolean(),
  Business: z.boolean(),
  External: z.boolean(),
  SeniorManagement: z.boolean(),
  other: z.string().optional(),
});

// Customers
const customersSchema = z.object({
  identified: z.string().min(1, "Required"),
  documented: z.string().min(1, "Required"),
  differentiatedOutput: z.string().min(1, "Required"),
  slas: z.string().min(1, "Required"),
  updates: z.string().min(1, "Required"),
  satisfaction: z.string().min(1, "Required"),
});

// Charter Elements
const charterElementsSchema = z.object({
  Mission: z.boolean(),
  Vision: z.boolean(),
  Strategy: z.boolean(),
  ServiceScope: z.boolean(),
  Deliverables: z.boolean(),
  Responsibilities: z.boolean(),
  Accountability: z.boolean(),
  OperationalHours: z.boolean(),
  Stakeholders: z.boolean(),
  ObjectivesGoals: z.boolean(),
  StatementOfSuccess: z.boolean(),
});

// Charter
const charterSchema = z.object({
  exists: z.string().min(1, "Required"),
  elements: charterElementsSchema,
  updates: z.string().min(1, "Required"),
});

// Complete Schema
export const businessSectionSchema = z.object({
  businessDrivers: businessDriversSchema,
  customers: customersSchema,
  customerTypes: customerTypesSchema,
  charter: charterSchema,
});

// Types
export type BusinessDrivers = z.infer<typeof businessDriversSchema>;
export type Customers = z.infer<typeof customersSchema>;
export type CustomerTypes = z.infer<typeof customerTypesSchema>;
export type CharterElements = z.infer<typeof charterElementsSchema>;
export type Charter = z.infer<typeof charterSchema>;
export type BusinessSectionData = z.infer<typeof businessSectionSchema>;

// Type-safe paths
export type CustomerTypeField = `customerTypes.${keyof CustomerTypes}`;
export type CharterElementField = `charter.elements.${keyof CharterElements}`;