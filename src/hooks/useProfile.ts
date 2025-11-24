import { useQuery } from "@tanstack/react-query";
import {
  getAllProfiles,
  getProfileDetailsById,
  getAllStudents,
  getAllUnits,
  getProfileStats,
  getActiveInternships,
  getTotalApplications,
  getActiveCourses,
  getHiredStats
} from "@/services/profile.service";
import type {
  StudentProfileData,
  UnitProfileData,
} from "@/types/profile.types";
import { getUnitApplicationCount } from "@/services/internship.service";
import { suspendUnit } from "@/services/suspend.service";

// GET ALL PROFILES
export const useAllProfiles = (
  page: number = 1,
  pageSize: number = 20,
  role?: "student" | "unit",
  searchTerm?: string
) => {
  return useQuery({
    queryKey: ["profiles", page, pageSize, role, searchTerm],
    queryFn: () => getAllProfiles(page, pageSize, role, searchTerm),
  });
};

// GET PROFILE DETAILS BY ID
export const useProfileDetails = (profileId: string) => {
  return useQuery<{
    data: StudentProfileData | UnitProfileData | null;
    error: any;
  }>({
    queryKey: ["profileDetails", profileId],
    queryFn: () => getProfileDetailsById(profileId),
    enabled: !!profileId,
  });
};

// GET ALL STUDENTS
export const useAllStudents = (
  page: number = 1,
  pageSize: number = 20,
  searchTerm?: string
) => {
  return useQuery({
    queryKey: ["students", page, pageSize, searchTerm],
    queryFn: () => getAllStudents(page, pageSize, searchTerm),
  });
};

// GET ALL UNITS
export const useAllUnits = (
  page: number = 1,
  pageSize: number = 20,
  searchTerm?: string
) => {
  return useQuery({
    queryKey: ["units", page, pageSize, searchTerm],
    queryFn: () => getAllUnits(page, pageSize, searchTerm),
  });
};

// GET PROFILE STATISTICS
export const useProfileStats = () => {
  return useQuery({
    queryKey: ["profileStats"],
    queryFn: getProfileStats,
  });
};

// GET TOTAL ACTIVE INTERNSHIPS
export const useActiveInternships = () => {
  return useQuery({
    queryKey: ["activeInternships"],
    queryFn: getActiveInternships,
  });
};

export const useActiveCourses = () => {
  return useQuery({
    queryKey: ["activeCourses"],
    queryFn: getActiveCourses,
  });
};

export const useHiredStats = () => {
  return useQuery({
    queryKey: ["hiredStats"],
    queryFn: getHiredStats,
  });
};

// GET TOTAL APPLICATIONS
export const useTotalApplications = () => {
  return useQuery({
    queryKey: ["totalApplications"],
    queryFn: getTotalApplications,
  });
};

// GET PROFILE DETAILS BY ID
export const useUnitApplicationCount = (unitId: string) => {
  return useQuery({
    queryKey: ["UnitApplicationCount", unitId],
    queryFn: () => getUnitApplicationCount(unitId),
    enabled: !!unitId,
  });
};

// // GET PROFILE DETAILS BY ID
// export const useSuspendUnit = (unitId: string) => {
//   return useQuery({
//     queryKey: ["suspendUnit", unitId],
//     queryFn: () => suspendUnit(unitId),
//     enabled: !!unitId,
//   });
// };
