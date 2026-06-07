import { Sparkle } from "lucide-react";

interface SectionBadgeProps {
  label: string;
}

export default function SectionBadge({ label }: SectionBadgeProps) {
  return (
    <div className="section-badge">
      <Sparkle size={16} />
      <span className="shimmer-text">{label}</span>
    </div>
  );
}
