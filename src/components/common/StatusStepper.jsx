import React from "react";
import {
  Edit3,
  Send,
  Clock,
  AlertCircle,
  X,
  Award,
  CheckCircle,
} from "react-feather";

const steps = [
  { key: "draft", label: "Draft", icon: <Edit3 size={18} /> },
  { key: "submitted", label: "Submitted", icon: <Send size={18} /> },
  { key: "under_review", label: "Under Review", icon: <Clock size={18} /> },
  {
    key: "changes_requested",
    label: "Changes Requested",
    icon: <AlertCircle size={18} />,
  },
  { key: "rejected", label: "Rejected", icon: <X size={18} /> },
  { key: "published", label: "Published", icon: <Award size={18} /> },
];

const normalize = (s) => (s === "republished" ? "published" : s);

const StatusStepper = ({ status }) => {
  const active = steps.findIndex((s) => s.key === normalize(status)) ?? 0;

  return (
    <div className="d-flex flex-column gap-2">
      {steps.map((step, index) => {
        const isActive = index === active;
        const isCompleted = index < active;

        return (
          <div
            key={step.key}
            className={`
              d-flex align-items-center p-2 rounded border 
              ${isActive ? "border-primary bg-light" : ""}
              ${isCompleted ? "border-success bg-success bg-opacity-10" : ""}
            `}
          >
            <span className="me-2">
              {isCompleted ? (
                <CheckCircle size={18} className="text-success" />
              ) : (
                step.icon
              )}
            </span>
            <strong>{step.label}</strong>
          </div>
        );
      })}
    </div>
  );
};

export default StatusStepper;
