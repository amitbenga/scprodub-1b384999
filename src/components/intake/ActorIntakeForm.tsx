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
import { Loader2, User, Briefcase, Languages, Sparkles, FileText, Image } from "lucide-react";

import { FormSection } from "./FormSection";
import { ChipSelect } from "./ChipSelect";
import { FileUpload } from "./FileUpload";
import { SuccessScreen } from "./SuccessScreen";
import scprodubLogo from "@/assets/scprodub-logo.png";
import scWebsiteLogo from "@/assets/sc-website-logo.png";
import microphoneBg from "@/assets/microphone-bg.jpg";

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
    <div className="min-h-screen relative">
      {/* Fixed microphone background decorations */}
      <div className="fixed top-0 left-0 h-screen w-[350px] opacity-20 pointer-events-none hidden lg:block z-0">
        <img 
          src={microphoneBg} 
          alt="" 
          className="w-full h-full object-contain object-top grayscale"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>
      <div className="fixed top-0 right-0 h-screen w-[350px] opacity-20 pointer-events-none hidden lg:block z-0">
        <img 
          src={microphoneBg} 
          alt="" 
          className="w-full h-full object-contain object-top grayscale"
        />
      </div>

      {/* White fade gradient overlay for center content */}
      <div className="fixed inset-0 pointer-events-none z-[1] hidden lg:block"
        style={{
          background: 'linear-gradient(to right, transparent 0%, transparent 15%, rgba(255,255,255,0.85) 25%, rgba(255,255,255,0.95) 35%, rgba(255,255,255,0.95) 65%, rgba(255,255,255,0.85) 75%, transparent 85%, transparent 100%)'
        }}
      />

      <div className="py-8 px-4 relative z-10">
        <div className="max-w-lg md:max-w-2xl mx-auto relative">
        {/* Header with logo and social links */}
        <header className="flex items-center justify-between mb-8 px-2">
          {/* Logo - Right side (RTL so appears on right) */}
          <img src={scprodubLogo} alt="SCprodub" className="h-10" />

          {/* Social Links - Left side (RTL so appears on left) */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.facebook.com/sc.produb.5"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
              aria-label="פייסבוק"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/scprodub/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
              aria-label="אינסטגרם"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://www.sc-produb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors overflow-hidden"
              aria-label="אתר SCprodub"
            >
              <img src={scWebsiteLogo} alt="SC" className="w-6 h-6 object-contain" />
            </a>
          </div>
        </header>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">טופס הרשמה לשחקני דיבוב</h1>
          <p className="text-muted-foreground">הצטרפו למאגר השחקנים שלנו ותהיו חלק מהפקות בינלאומיות</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Details */}
          <FormSection title="פרטים אישיים" icon={User}>
            <p className="text-xs text-muted-foreground -mt-2 mb-4">משמש לזיהוי במערכת</p>
            
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
          <FormSection title="מידע מקצועי" icon={Briefcase}>
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
          <FormSection title="שפות" icon={Languages}>
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
          <FormSection title="כישורים" icon={Sparkles}>
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
          <FormSection title="מידע משלים" icon={FileText}>
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
          <FormSection title="מדיה (מומלץ)" icon={Image}>
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin ml-2 inline" />
                שולח...
              </>
            ) : (
              "שליחה"
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}