import { CheckCircle } from "lucide-react";

export function SuccessScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-14 w-14 text-success" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            תודה רבה! הפרטים נקלטו ונבדוק אותם בהקדם 🙂
          </h1>
          <p className="text-muted-foreground">
            קיבלנו את הפרטים שלך ונעבור עליהם בהקדם האפשרי.
          </p>
        </div>
      </div>
    </div>
  );
}