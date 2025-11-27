import { supabase } from "@/integrations/supabase/client";

export const suspendCourse = async (courseId: string) => {
  // if (!confirm("Are you sure you want to suspend this course?")) return;

  // 1️⃣ Mark course as suspended
  const { error: updateError } = await supabase
    .from("courses")
    .update({ is_suspended: true })
    .eq("id", courseId);

  if (updateError) {
    console.error(updateError);
    alert("Failed to update course.");
    return;
  }
  alert("Course suspended successfully!");
};
