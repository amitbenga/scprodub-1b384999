import { CheckCircle } from "lucide-react";

export function SuccessScreen() {
  return (
    <div className="success-screen">
      <CheckCircle className="success-icon" />
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-foreground">
          תודה רבה! הפרטים נקלטו ונבדוק אותם בהקדם 🙂
        </h1>
        <p className="text-muted-foreground">
          קיבלנו את הפרטים שלך ונעבור עליהם בהקדם האפשרי.
        </p>
      </div>
    </div>
  );
}
