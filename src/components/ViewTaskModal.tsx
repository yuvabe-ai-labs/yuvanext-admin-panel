import { X, Calendar, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { TaskItem } from "@/types/candidateTasks.types";

interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem; // Updated to use TaskItem to match your existing types
}

export default function ViewTaskModal({
  isOpen,
  onClose,
  task,
}: ViewTaskModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500";
      case "redo":
        return "bg-orange-500";
      case "submitted":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "redo":
        return "Needs Redo";
      case "submitted":
        return "Submitted";
      default:
        return "Pending";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold text-gray-900">
                {task.taskTitle}
              </DialogTitle>
              <Badge
                className={`${getStatusColor(task.taskStatus)} text-white`}
              >
                {getStatusLabel(task.taskStatus)}
              </Badge>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Description */}
          {task.taskDescription && (
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Description
              </label>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                {task.taskDescription}
              </p>
            </div>
          )}

          {/* Date Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Start date
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {task.taskStartDate
                    ? format(new Date(task.taskStartDate), "dd MMM yyyy")
                    : "Not set"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Due date
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 font-medium text-orange-600">
                  {task.taskEndDate
                    ? format(new Date(task.taskEndDate), "dd MMM yyyy")
                    : "Not set"}
                </span>
              </div>
            </div>
          </div>

          {/* Submission Link */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Submission link
            </label>
            {task.taskSubmissionLink ? (
              <a
                href={task.taskSubmissionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-blue-600 hover:text-blue-700 border border-blue-100 rounded-xl bg-blue-50/50 transition-colors truncate"
              >
                <LinkIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">{task.taskSubmissionLink}</span>
              </a>
            ) : (
              <div className="px-3 py-2.5 text-sm text-gray-400 border border-gray-200 rounded-xl bg-gray-50 italic">
                No submission link provided
              </div>
            )}
          </div>

          {/* Remarks */}
          {task.taskReviewRemarks && (
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Review Remarks
              </label>
              <div className="text-sm text-gray-700 leading-relaxed bg-orange-50/30 p-3 rounded-xl border border-orange-100">
                {task.taskReviewRemarks}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
