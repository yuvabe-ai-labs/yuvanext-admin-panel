interface Profile {
  profile: {
    created_at: string;
  };
}

export function getNewProfilesThisMonth(profiles: Profile[]): number {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return profiles.filter(
    (item) => new Date(item.profile.created_at) >= startOfMonth
  ).length;
}

export function calculateMonthlySignups(
  students: Profile[],
  units: Profile[]
): Array<{ month: string; value: number }> {
  const allProfiles = [
    ...students.map((s) => s.profile),
    ...units.map((u) => u.profile),
  ];

  const monthsData = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = monthDate.toLocaleDateString("en-US", { month: "short" });
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const signupsInMonth = allProfiles.filter((profile) => {
      const createdAt = new Date(profile.created_at);
      return createdAt >= monthDate && createdAt < nextMonth;
    }).length;

    monthsData.push({
      month: monthName,
      value: signupsInMonth,
    });
  }

  return monthsData;
}
