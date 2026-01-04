import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
}

export function FormSection({ title, icon: Icon, children }: FormSectionProps) {
  return (
    <section className="form-section">
      <h2 className="form-section-header">
        {Icon && <Icon className="form-section-header-icon" />}
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
