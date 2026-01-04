import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

import { FormSection } from "./FormSection";
import { ChipSelect } from "./ChipSelect";
import { FileUpload } from "./FileUpload";
import { SuccessScreen } from "./SuccessScreen";

import { uploadFile, validateImageFile, validateAudioFile } from "@/lib/file-upload";
import {
  normalizeEmail,
  normalizePhone,
  validateEmail,
  validatePhone,
  validateBirthYear,
} from "@/lib/form-utils";

const LANGUAGES = ["עברית", "אנגלית", "ערבית", "רוסית", "צרפתית", "אחר"];
const SKILLS = ["דיבוב", "קריינות", "משחק", "שירה", "קומדיה", "אחר"];
const GENDERS = [
  { value: "זכר", label: "זכר" },
  { value: "נקבה", label: "נקבה" },
  { value: "אחר", label: "אחר" },
];
const VAT_STATUSES = [
  { value: "עוסק פטור", label: "עוסק פטור" },
  { value: "עוסק מורשה", label: "עוסק מורשה" },
  { value: "שכר אמנים", label: "שכר אמנים" },
];

const BIRTH_YEARS = Array.from({ length: 71 }, (_, i) => 2010 - i);

interface FormErrors {
  full_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  birth_year?: string;
  vat_status?: string;
  languages?: string;
  image?: string;
  voice_sample?: string;
}

export function ActorIntakeForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthYear, setBirthYear] = useState<string>("");
  const [vatStatus, setVatStatus] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [languagesOther, setLanguagesOther] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsOther, setSkillsOther] = useState("");
  const [isSinger, setIsSinger] = useState<string>("");
  const [isCourseGraduate, setIsCourseGraduate] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [voiceSampleFile, setVoiceSampleFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) {
      newErrors.full_name = "נא למלא שם מלא";
    }
    if (!email.trim() || !validateEmail(email)) {
      newErrors.email = "נא למלא אימייל תקין";
    }
    if (!phone.trim() || !validatePhone(phone)) {
      newErrors.phone = "נא למלא מספר טלפון תקין";
    }
    if (!gender) {
      newErrors.gender = "נא לבחור מגדר";
    }
    if (!birthYear || !validateBirthYear(parseInt(birthYear))) {
      newErrors.birth_year = "נא לבחור שנת לידה תקינה";
    }
    if (!vatStatus) {
      newErrors.vat_status = "נא לבחור סטטוס עוסק";
    }
    if (languages.length === 0) {
      newErrors.languages = "נא לבחור לפחות שפה אחת";
    }

    if (imageFile) {
      const validation = validateImageFile(imageFile);
      if (!validation.valid) {
        newErrors.image = validation.error;
      }
    }

    if (voiceSampleFile) {
      const validation = validateAudioFile(voiceSampleFile);
      if (!validation.valid) {
        newErrors.voice_sample = validation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: "שגיאה",
        description: "נא לתקן את השגיאות בטופס",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files
      let imageUrl: string | null = null;
      let voiceSampleUrl: string | null = null;

      if (imageFile) {
        const result = await uploadFile(imageFile, "images");
        if (result.error) {
          throw new Error(result.error);
        }
        imageUrl = result.url;
      }

      if (voiceSampleFile) {
        const result = await uploadFile(voiceSampleFile, "audio");
        if (result.error) {
          throw new Error(result.error);
        }
        voiceSampleUrl = result.url;
      }

      // Prepare data
      const formData = {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender,
        birth_year: birthYear,
        vat_status: vatStatus,
        languages,
        languages_other: languagesOther || null,
        skills: skills.length > 0 ? skills : null,
        skills_other: skillsOther || null,
        is_singer: isSinger || null,
        is_course_graduate: isCourseGraduate || null,
        notes: notes || null,
        image_url: imageUrl,
        voice_sample_url: voiceSampleUrl,
      };

      const insertData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        normalized_email: normalizeEmail(formData.email),
        normalized_phone: normalizePhone(formData.phone),
        gender: formData.gender,
        birth_year: parseInt(formData.birth_year),
        vat_status: formData.vat_status,
        languages: formData.languages,
        languages_other: formData.languages_other,
        skills: formData.skills,
        skills_other: formData.skills_other,
        is_singer: formData.is_singer === "כן" ? true : formData.is_singer === "לא" ? false : null,
        is_course_graduate: formData.is_course_graduate === "כן" ? true : formData.is_course_graduate === "לא" ? false : null,
        notes: formData.notes,
        image_url: formData.image_url,
        voice_sample_url: formData.voice_sample_url,
        match_status: "pending" as const,
        matched_actor_id: null,
        review_status: "pending" as const,
        raw_payload: {
          ...formData,
          submitted_at: new Date().toISOString(),
        },
      };

      const { error } = await supabase.from("actor_submissions").insert(insertData);

      if (error) {
        throw error;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Submit error:", err);
      toast({
        title: "שגיאה בשליחת הטופס",
        description: "נא לנסות שוב מאוחר יותר",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <SuccessScreen />;
  }

  const showLanguagesOther = languages.includes("אחר");
  const showSkillsOther = skills.includes("אחר");

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">SCprodub</h1>
          <p className="text-muted-foreground">טופס הרשמה לשחקנים</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 rounded-xl shadow-sm border border-border">
          {/* Section 1: Personal Details */}
          <FormSection title="פרטים אישיים">
            <p className="text-xs text-muted-foreground -mt-2">משמש לזיהוי במערכת</p>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">שם מלא *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={errors.full_name ? "border-destructive" : ""}
              />
              {errors.full_name && (
                <p className="text-xs text-destructive">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">אימייל *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">טלפון *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>
          </FormSection>

          {/* Section 2: Professional Info */}
          <FormSection title="מידע מקצועי">
            <div className="space-y-2">
              <Label>מגדר *</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                  <SelectValue placeholder="בחירה..." />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-destructive">{errors.gender}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>שנת לידה *</Label>
              <Select value={birthYear} onValueChange={setBirthYear}>
                <SelectTrigger className={errors.birth_year ? "border-destructive" : ""}>
                  <SelectValue placeholder="בחירה..." />
                </SelectTrigger>
                <SelectContent>
                  {BIRTH_YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.birth_year && (
                <p className="text-xs text-destructive">{errors.birth_year}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>סטטוס עוסק *</Label>
              <Select value={vatStatus} onValueChange={setVatStatus}>
                <SelectTrigger className={errors.vat_status ? "border-destructive" : ""}>
                  <SelectValue placeholder="בחירה..." />
                </SelectTrigger>
                <SelectContent>
                  {VAT_STATUSES.map((vs) => (
                    <SelectItem key={vs.value} value={vs.value}>
                      {vs.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vat_status && (
                <p className="text-xs text-destructive">{errors.vat_status}</p>
              )}
            </div>
          </FormSection>

          {/* Section 3: Languages */}
          <FormSection title="שפות">
            <div className="space-y-2">
              <Label>שפות *</Label>
              <ChipSelect
                options={LANGUAGES}
                selected={languages}
                onChange={setLanguages}
              />
              {errors.languages && (
                <p className="text-xs text-destructive">{errors.languages}</p>
              )}
            </div>

            {showLanguagesOther && (
              <div className="space-y-2">
                <Label htmlFor="languagesOther">שפה אחרת</Label>
                <Input
                  id="languagesOther"
                  value={languagesOther}
                  onChange={(e) => setLanguagesOther(e.target.value)}
                  placeholder="פרט את השפה..."
                />
                {languages.includes("אחר") && !languagesOther && (
                  <p className="text-xs text-gold">בחרת ״אחר״ — נא לציין פרטים</p>
                )}
              </div>
            )}
          </FormSection>

          {/* Section 4: Skills */}
          <FormSection title="כישורים">
            <div className="space-y-2">
              <Label>כישורים</Label>
              <ChipSelect
                options={SKILLS}
                selected={skills}
                onChange={setSkills}
              />
            </div>

            {showSkillsOther && (
              <div className="space-y-2">
                <Label htmlFor="skillsOther">כישור אחר</Label>
                <Input
                  id="skillsOther"
                  value={skillsOther}
                  onChange={(e) => setSkillsOther(e.target.value)}
                  placeholder="פרט את הכישור..."
                />
                {skills.includes("אחר") && !skillsOther && (
                  <p className="text-xs text-gold">בחרת ״אחר״ — נא לציין פרטים</p>
                )}
              </div>
            )}
          </FormSection>

          {/* Section 5: Additional Info */}
          <FormSection title="מידע משלים">
            <div className="space-y-2">
              <Label>זמר/ת</Label>
              <RadioGroup
                value={isSinger}
                onValueChange={setIsSinger}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="כן" id="singer-yes" />
                  <Label htmlFor="singer-yes" className="font-normal cursor-pointer">
                    כן
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="לא" id="singer-no" />
                  <Label htmlFor="singer-no" className="font-normal cursor-pointer">
                    לא
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>בוגר/ת קורס</Label>
              <RadioGroup
                value={isCourseGraduate}
                onValueChange={setIsCourseGraduate}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="כן" id="course-yes" />
                  <Label htmlFor="course-yes" className="font-normal cursor-pointer">
                    כן
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="לא" id="course-no" />
                  <Label htmlFor="course-no" className="font-normal cursor-pointer">
                    לא
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">הערות</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="מידע נוסף שחשוב לנו לדעת"
                rows={3}
              />
            </div>
          </FormSection>

          {/* Section 6: Media */}
          <FormSection title="מדיה (מומלץ)">
            <div className="space-y-2">
              <Label>תמונה</Label>
              <FileUpload
                type="image"
                value={imageFile}
                onChange={setImageFile}
                helper="מלהקים נוטים לבחור שחקנים עם תמונה"
                error={errors.image}
              />
            </div>

            <div className="space-y-2">
              <Label>דוגמת קול</Label>
              <FileUpload
                type="audio"
                value={voiceSampleFile}
                onChange={setVoiceSampleFile}
                helper="מאוד מומלץ לצרף דוגמת קול"
                error={errors.voice_sample}
              />
            </div>
          </FormSection>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin ml-2" />
                שולח...
              </>
            ) : (
              "שליחה"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}