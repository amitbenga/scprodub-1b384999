import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, User, Briefcase, Languages, Sparkles, FileText, Image, Music, Plus, X } from "lucide-react";

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
const SKILLS = ["קריינות", "מבטא רוסי", "כל מבטא אפשרי", "אחר"];
const GENDERS = [
  { value: "male", label: "זכר" },
  { value: "female", label: "נקבה" },
];
const VAT_STATUSES = [
  { value: "ptor", label: "עוסק פטור" },
  { value: "murshe", label: "עוסק מורשה" },
  { value: "artist_salary", label: "שכר אמנים" },
];

const SINGING_LEVELS = [
  { value: "", label: "לא רלוונטי" },
  { value: "basic", label: "שירה ברמה בסיסית" },
  { value: "good", label: "שירה ברמה טובה" },
  { value: "high", label: "שירה ברמה גבוהה" },
];

const SINGING_STYLES = [
  { value: "musical", label: "מוזיקל" },
  { value: "classic", label: "קלאסי" },
  { value: "pop", label: "פופ" },
  { value: "opera", label: "אופרה" },
  { value: "jazz", label: "ג׳אז" },
  { value: "rock", label: "רוק" },
];

const BIRTH_YEARS = Array.from({ length: 71 }, (_, i) => 2010 - i);

interface OtherSingingStyle {
  name: string;
  level: string;
}

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

  // Form state - Personal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthYear, setBirthYear] = useState<string>("");
  const [city, setCity] = useState("");
  
  // Dubbing experience
  const [dubbingExperienceYears, setDubbingExperienceYears] = useState<string>("0");
  
  // Singing
  const [singingLevel, setSingingLevel] = useState<string>("");
  const [singingStyles, setSingingStyles] = useState<string[]>([]);
  const [singingStylesOther, setSingingStylesOther] = useState<OtherSingingStyle[]>([]);
  const [newOtherStyleName, setNewOtherStyleName] = useState("");
  const [newOtherStyleLevel, setNewOtherStyleLevel] = useState<"basic" | "good" | "high">("basic");
  
  // Other fields
  const [vatStatus, setVatStatus] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [languagesOther, setLanguagesOther] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsOther, setSkillsOther] = useState("");
  const [isCourseGraduate, setIsCourseGraduate] = useState(false);
  const [studiedAt, setStudiedAt] = useState<string>("");
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

  const addOtherSingingStyle = () => {
    if (newOtherStyleName.trim()) {
      setSingingStylesOther([
        ...singingStylesOther,
        { name: newOtherStyleName.trim(), level: newOtherStyleLevel }
      ]);
      setNewOtherStyleName("");
      setNewOtherStyleLevel("basic");
    }
  };

  const removeOtherSingingStyle = (index: number) => {
    setSingingStylesOther(singingStylesOther.filter((_, i) => i !== index));
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
    console.log("[ActorIntakeForm] Starting submission...");

    try {
      // Upload files
      let imageUrl: string | null = null;
      let voiceSampleUrl: string | null = null;

      if (imageFile) {
        console.log("[ActorIntakeForm] Uploading image...", imageFile.name, imageFile.type);
        const result = await uploadFile(imageFile, "images");
        if (result.error) {
          console.error("[ActorIntakeForm] Image upload failed:", result.error);
          throw new Error(`שגיאה בהעלאת התמונה: ${result.error}`);
        }
        imageUrl = result.url;
        console.log("[ActorIntakeForm] Image uploaded:", imageUrl);
      }

      if (voiceSampleFile) {
        console.log("[ActorIntakeForm] Uploading voice sample...", voiceSampleFile.name, voiceSampleFile.type);
        const result = await uploadFile(voiceSampleFile, "audio");
        if (result.error) {
          console.error("[ActorIntakeForm] Voice sample upload failed:", result.error);
          throw new Error(`שגיאה בהעלאת קובץ הקול: ${result.error}`);
        }
        voiceSampleUrl = result.url;
        console.log("[ActorIntakeForm] Voice sample uploaded:", voiceSampleUrl);
      }

      // Determine is_singer based on singing level
      const isSingerValue = singingLevel && singingLevel !== "none" ? true : false;

      // Prepare data for actor_submissions table
      const insertData = {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        normalized_email: normalizeEmail(email.trim()),
        normalized_phone: normalizePhone(phone.trim()),
        gender,
        birth_year: parseInt(birthYear),
        vat_status: vatStatus,
        languages,
        languages_other: languagesOther || null,
        skills: skills.length > 0 ? skills : null,
        skills_other: skillsOther || null,
        is_singer: isSingerValue,
        is_course_graduate: isCourseGraduate,
        notes: notes || null,
        image_url: imageUrl,
        voice_sample_url: voiceSampleUrl,
        match_status: "pending" as const,
        matched_actor_id: null,
        review_status: "pending" as const,
        raw_payload: {
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          gender,
          birth_year: birthYear,
          city: city || null,
          vat_status: vatStatus,
          languages,
          languages_other: languagesOther || null,
          skills: skills.length > 0 ? skills : null,
          skills_other: skillsOther || null,
          dubbing_experience_years: parseInt(dubbingExperienceYears) || 0,
          singing_level: singingLevel && singingLevel !== "none" ? singingLevel : null,
          singing_styles: singingStyles,
          singing_styles_other: singingStylesOther.map(s => ({ name: s.name, level: s.level })),
          studied_at: studiedAt.trim() || null,
          notes: notes || null,
          image_url: imageUrl,
          voice_sample_url: voiceSampleUrl,
          submitted_at: new Date().toISOString(),
        } as Json,
      };

      // NOTE: Do not call .select() here.
      // RLS allows public INSERTs but SELECT is restricted to admins.
      console.log("[ActorIntakeForm] Inserting data");

      const { error } = await supabase.from("actor_submissions").insert([insertData]);

      if (error) {
        console.error("[ActorIntakeForm] Supabase insert error:", error);
        throw new Error(error.message);
      }

      console.log("[ActorIntakeForm] Insert successful");
      setIsSuccess(true);
    } catch (err) {
      console.error("[ActorIntakeForm] Submit error:", err);
      const errorMessage = err instanceof Error ? err.message : "נא לנסות שוב מאוחר יותר";
      toast({
        title: "שגיאה בשליחת הטופס",
        description: errorMessage,
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
  const showSingingStyles = singingLevel && singingLevel !== "none";

  return (
    <div className="min-h-screen relative">
      {/* Fixed microphone background decorations */}
      <div className="fixed top-0 left-0 h-screen w-[400px] opacity-25 pointer-events-none hidden lg:block z-0">
        <img 
          src={microphoneBg} 
          alt="" 
          className="w-full h-full object-cover object-center grayscale"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>
      <div className="fixed top-0 right-0 h-screen w-[400px] opacity-25 pointer-events-none hidden lg:block z-0">
        <img 
          src={microphoneBg} 
          alt="" 
          className="w-full h-full object-cover object-center grayscale"
        />
      </div>

      {/* Soft radial fade overlay for center content */}
      <div className="fixed inset-0 pointer-events-none z-[1] hidden lg:block"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.6) 70%, transparent 100%)'
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
              <Label htmlFor="city">עיר</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="עיר מגורים"
              />
            </div>
          </FormSection>

          {/* Section 2: Dubbing Experience */}
          <FormSection title="ניסיון בדיבוב" icon={Briefcase}>
            <div className="space-y-2">
              <Label htmlFor="dubbingExperience">ניסיון בדיבוב (בשנים)</Label>
              <Input
                id="dubbingExperience"
                type="number"
                min="0"
                max="50"
                value={dubbingExperienceYears}
                onChange={(e) => setDubbingExperienceYears(e.target.value)}
                className="w-32"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isCourseGraduate"
                checked={isCourseGraduate}
                onCheckedChange={(checked) => setIsCourseGraduate(checked === true)}
              />
              <Label htmlFor="isCourseGraduate" className="font-normal cursor-pointer">
                בוגר/ת קורס דיבוב
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studiedAt">לימודים</Label>
              <Input
                id="studiedAt"
                value={studiedAt}
                onChange={(e) => setStudiedAt(e.target.value)}
                placeholder="שם הקורס / המוסד הלימודי (אם רלוונטי)"
              />
            </div>
          </FormSection>

          {/* Section 3: Singing */}
          <FormSection title="שירה" icon={Music}>
            <div className="space-y-2">
              <Label>רמת שירה</Label>
              <Select value={singingLevel} onValueChange={setSingingLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="בחירה..." />
                </SelectTrigger>
                <SelectContent>
                  {SINGING_LEVELS.map((level) => (
                    <SelectItem key={level.value || "none"} value={level.value || "none"}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showSingingStyles && (
              <>
                <div className="space-y-2">
                  <Label>סגנונות שירה</Label>
                  <ChipSelect
                    options={SINGING_STYLES.map(s => s.label)}
                    selected={singingStyles.map(v => SINGING_STYLES.find(s => s.value === v)?.label || v)}
                    onChange={(selected) => {
                      const values = selected.map(label => 
                        SINGING_STYLES.find(s => s.label === label)?.value || label
                      );
                      setSingingStyles(values);
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <Label>סגנונות שירה נוספים</Label>
                  
                  {/* List of added other styles */}
                  {singingStylesOther.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {singingStylesOther.map((style, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          <span>{style.name}</span>
                          <span className="text-xs opacity-70">
                            ({SINGING_LEVELS.find(l => l.value === style.level)?.label || style.level})
                          </span>
                          <button
                            type="button"
                            onClick={() => removeOtherSingingStyle(index)}
                            className="mr-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new other style */}
                  <div className="flex flex-wrap gap-2 items-end">
                    <div className="flex-1 min-w-[150px]">
                      <Input
                        value={newOtherStyleName}
                        onChange={(e) => setNewOtherStyleName(e.target.value)}
                        placeholder="שם הסגנון"
                      />
                    </div>
                    <div className="w-40">
                      <Select value={newOtherStyleLevel} onValueChange={(v) => setNewOtherStyleLevel(v as "basic" | "good" | "high")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">רמה בסיסית</SelectItem>
                          <SelectItem value="good">רמה טובה</SelectItem>
                          <SelectItem value="high">רמה גבוהה</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addOtherSingingStyle}
                      disabled={!newOtherStyleName.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
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

          {/* Section 5: Languages */}
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

          {/* Section 6: VAT Status */}
          <FormSection title="סטטוס עוסק" icon={FileText}>
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

          {/* Section 7: Notes */}
          <FormSection title="הערות" icon={FileText}>
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

          {/* Section 8: Media */}
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
