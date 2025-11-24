import { supabase } from "@/integrations/supabase/client";

export const suspendUnit = async (unitId: string) => {
  if (!confirm("Are you sure you want to suspend this unit?")) return;

  // 1️⃣ Mark unit as suspended
  const { error: updateError } = await supabase
    .from("units")
    .update({ is_suspended: true })
    .eq("id", unitId);

  if (updateError) {
    console.error(updateError);
    alert("Failed to update unit.");
    return;
  }

  // 2️⃣ Fetch the unit row (get profile_id)
  const { data: unit, error: unitError } = await supabase
    .from("units")
    .select("id, profile_id")
    .eq("id", unitId)
    .single();

  if (unitError || !unit) {
    console.error(unitError);
    alert("Unit not found.");
    return;
  }

  // 3️⃣ Fetch the profile (get auth user_id)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("id", unit.profile_id)
    .single();

  if (profileError || !profile) {
    console.error(profileError);
    alert("Profile not found.");
    return;
  }

  // // 1️⃣ Mark unit profiles as suspended
  // const { error: profileUpdateError } = await supabase
  //   .from("profiles")
  //   .update({ is_suspended: true })
  //   .eq("id", unit.profile_id);

  // if (profileUpdateError) {
  //   console.error(profileUpdateError);
  //   alert("Failed to update profile.");
  //   return;
  // }

  const authUserId = profile.user_id; // this is the real Auth UUID

  // 4️⃣ Call the Edge Function to ban the user
  const { error: fnError } = await supabase.functions.invoke("suspend-unit", {
    body: { auth_id: authUserId },
  });

  if (fnError) {
    console.error(fnError);
    alert("Failed to suspend auth user.");
    return;
  }

  alert("Unit suspended successfully!");
};
