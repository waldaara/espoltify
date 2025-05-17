import type { z } from "zod";

import type { setupRemindersFormSchema } from "@/features/reminders/schema/setup-reminders-form-schema";

export type SetupRemindersFormValues = z.infer<typeof setupRemindersFormSchema>;

export interface Assignment {
  plannable_id: number;
  planner_override: null;
  plannable_type: string;
  new_activity: boolean;
  submissions: boolean | SubmissionsClass;
  plannable_date: Date;
  plannable: Plannable;
  context_type?: string;
  course_id?: number;
  html_url?: string;
  context_name?: string;
}

export interface Plannable {
  id: number;
  title: string;
  course_id?: null;
  todo_date?: Date;
  details?: string;
  created_at: Date;
  updated_at: Date;
  user_id?: number;
  points_possible?: number;
  due_at?: Date;
  assignment_id?: number;
}

export interface SubmissionsClass {
  submitted: boolean;
  excused: boolean;
  graded: boolean;
  late: boolean;
  missing: boolean;
  needs_grading: boolean;
  has_feedback: boolean;
}
