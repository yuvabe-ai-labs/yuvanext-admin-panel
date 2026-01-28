import type { Task, TaskStatus } from "@/types/candidateTasks.types";

/**
 * Calculate overall task progress with weighted statuses
 * - PENDING: 0% (not completed)
 * - SUBMITTED: 50% (partially completed)
 * - REDO: 0% (not completed)
 * - ACCEPTED: 100% (fully completed)
 */
export const calculateOverallTaskProgress = (tasks: Task[]): number => {
  if (!tasks || tasks.length === 0) {
    console.log("No tasks to calculate progress");
    return 0;
  }

  const statusWeights: Record<TaskStatus, number> = {
    pending: 0,
    submitted: 0.5,
    redo: 0,
    accepted: 1,
  };

  console.log("Status weights:", statusWeights);

  const totalWeight = tasks.reduce((sum, task) => {
    const weight = statusWeights[task.taskStatus] || 0;
    console.log(
      `Task: ${task.taskTitle}, Status: ${task.taskStatus}, Weight: ${weight}`,
    );
    return sum + weight;
  }, 0);

  const progressPercentage = Math.round((totalWeight / tasks.length) * 100);

  console.log(
    `Total weight: ${totalWeight}, Total tasks: ${tasks.length}, Progress: ${progressPercentage}%`,
  );

  return progressPercentage;
};

export const getOverallTaskBreakdown = (tasks: Task[]) => {
  if (!tasks || tasks.length === 0) {
    return {
      total: 0,
      completed: 0,
      partiallyCompleted: 0,
      incomplete: 0,
      progressPercentage: 0,
    };
  }

  const completed = tasks.filter((task) => task.taskStatus === "accepted");

  const partiallyCompleted = tasks.filter(
    (task) => task.taskStatus === "submitted",
  );

  const incomplete = tasks.filter(
    (task) => task.taskStatus === "pending" || task.taskStatus === "redo",
  );

  const progressPercentage = calculateOverallTaskProgress(tasks);

  return {
    total: tasks.length,
    completed: completed.length,
    partiallyCompleted: partiallyCompleted.length,
    incomplete: incomplete.length,
    progressPercentage,
  };
};

export const getTaskStatusCounts = (tasks: Task[]) => {
  if (!tasks || tasks.length === 0) {
    return {
      total: 0,
      pending: 0,
      submitted: 0,
      redo: 0,
      accepted: 0,
    };
  }

  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.taskStatus === "pending").length,
    submitted: tasks.filter((t) => t.taskStatus === "submitted").length,
    redo: tasks.filter((t) => t.taskStatus === "redo").length,
    accepted: tasks.filter((t) => t.taskStatus === "accepted").length,
  };
};
