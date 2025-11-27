import { z } from "zod";

export const createInternshipSchema = z.object({
  title: z.string().min(1, "Title is required"),
  duration: z.string().min(1, "Duration is required"),

  job_type: z.enum(["full_time", "part_time", "both"]),

  isPaid: z.boolean(),
  payment: z.string().optional(),

  min_age_required: z.string().min(1, "Minimum age is required"),

  description: z.string().min(1, "Description is required"),
  responsibilities: z.string(),
  benefits: z.string(),
  skills_required: z.string(),

  language_requirements: z.array(
    z.object({
      language: z.string(),
      read: z.boolean(),
      write: z.boolean(),
      speak: z.boolean(),
    })
  ),

  application_deadline: z.string().min(1, "Deadline is required"),

  created_by: z.string().min(1, "Creator ID is required"),
});

export type CreateInternshipFormType = z.infer<typeof createInternshipSchema>;
