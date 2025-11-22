
import type { StudentProfileData } from "@/types/profile.types";

export interface Application {
  id: string;
  student_id: string;
  internship_id: string;

  cover_letter: string | null;
  status: "applied" | "reviewed" | "accepted" | "rejected" | "withdrawn";
  applied_date: string;
  updated_at: string;

  profile_match_score: number | null;
  included_sections: string[];
}

export interface ApplicationWithStudent extends Application {
  student: StudentProfileData;  
}
