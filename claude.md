# SCprodub – External Actor Intake Form

## Overview

This is the **external** actor intake form for SCprodub, a dubbing production company. It shares a Supabase database with a separate internal management application. The form collects actor information and stores it in the `actor_submissions` table.

**Tech stack:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Supabase (external instance).

**Important:** The Supabase instance is external (not Lovable Cloud). Do not create migrations or modify the DB schema from this project.

---

## Form Structure (Current)

The form is implemented in `src/components/intake/ActorIntakeForm.tsx` (~758 lines).

### Sections in order:

| # | Section | Icon | Fields |
|---|---------|------|--------|
| 1 | פרטים אישיים (Personal Details) | `User` | שם מלא*, מגדר*, שנת לידה*, טלפון*, אימייל*, עיר |
| 2 | ניסיון בדיבוב (Dubbing Experience) | `Briefcase` | שנות ניסיון (number), בוגר/ת קורס דיבוב (checkbox), לימודים (text) |
| 3 | שירה (Singing) | `Music` | רמת שירה (select), סגנונות שירה (chips, conditional), סגנונות נוספים (text+add, conditional) |
| 4 | כישורים (Skills) | `Sparkles` | כישורים (chips), כישור אחר (text, conditional) |
| 5 | שפות בשליטה מלאה (Languages) | `Languages` | שפות* (chips), שפה אחרת (text, conditional) |
| 6 | סטטוס עוסק (VAT Status) | `FileText` | סטטוס עוסק* (select) |
| 7 | הערות (Notes) | `FileText` | הערות (textarea) |
| 8 | מדיה (Media) | `Image` | תמונה (file upload), דוגמת קול (audio record/upload), דוגמת שירה (audio record/upload), לינק ליוטיוב (url input) |

### Constants

```typescript
const LANGUAGES = ["עברית", "אנגלית", "ערבית", "רוסית", "צרפתית", "ספרדית", "גרמנית", "איטלקית", "אחר"];

const SKILLS = [
  "קריינות", "מבטא רוסי", "מבטא צרפתי", "מבטא איטלקי",
  "מבטא ספרדי", "מבטא גרמני", "מבטא אנגלי",
  "כל מבטא אפשרי", "אחר",
];

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

const SINGING_STYLES = ["מוזיקל", "קלאסי", "פופ", "אופרה", "ג׳אז", "רוק"];

const BIRTH_YEARS = Array.from({ length: 71 }, (_, i) => 2010 - i); // 2010 down to 1940
```

### State Variables

```typescript
// Personal
fullName, email, phone, gender, birthYear, city

// Experience
dubbingExperienceYears (string, default "0")
isCourseGraduate (boolean)
studiedAt (string)

// Singing
singingLevel (string)
singingStyles (string[])           // multi-select chips from SINGING_STYLES
singingStylesOther (string[])      // free-text additions
newOtherStyleName (string)         // temp input for adding other styles
singingSampleFile (File | null)

// Skills & Languages
skills (string[])
skillsOther (string)
languages (string[])
languagesOther (string)

// Other
vatStatus (string)
notes (string)
imageFile (File | null)
voiceSampleFile (File | null)
youtubeLink (string)
```

### Validation (required fields marked with *)

- `full_name` — non-empty
- `email` — valid email format
- `phone` — valid phone format
- `gender` — must be selected
- `birth_year` — valid year
- `vat_status` — must be selected
- `languages` — at least one selected
- `imageFile` / `voiceSampleFile` — validated for type/size if provided

### Submit Logic

1. Upload `imageFile` → `images/` folder in `actor-submissions` bucket
2. Upload `voiceSampleFile` → `audio/` folder
3. Upload `singingSampleFile` → `audio/` folder
4. Derive `is_singer` from `singingLevel` (true if level exists and not "none")
5. Insert into `actor_submissions` table with `raw_payload` containing all fields

### raw_payload Structure

```json
{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "gender": "string",
  "birth_year": "string",
  "city": "string | null",
  "vat_status": "string",
  "languages": ["string"],
  "languages_other": "string | null",
  "skills": ["string"] | null,
  "skills_other": "string | null",
  "dubbing_experience_years": 0,
  "singing_level": "string | null",
  "singing_styles": ["string"],
  "singing_styles_other": ["string"],
  "studied_at": "string | null",
  "notes": "string | null",
  "image_url": "string | null",
  "voice_sample_url": "string | null",
  "singing_sample_url": "string | null",
  "youtube_link": "string | null",
  "submitted_at": "ISO datetime"
}
```

---

## Database Schema

### Table: `actor_submissions`

Target table for the external form. All fields below are direct columns.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | No | gen_random_uuid() | PK |
| full_name | text | No | — | |
| email | text | No | — | |
| phone | text | No | — | |
| normalized_email | text | No | — | Lowercase, trimmed |
| normalized_phone | text | No | — | Digits only |
| gender | text | No | — | "male" / "female" |
| birth_year | integer | No | — | |
| vat_status | text | No | — | "ptor" / "murshe" / "artist_salary" |
| languages | text[] | No | — | Array of language names |
| languages_other | text | Yes | — | |
| skills | text[] | Yes | — | |
| skills_other | text | Yes | — | |
| is_singer | boolean | Yes | — | Derived from singing_level |
| is_course_graduate | boolean | Yes | — | |
| singing_level | text | Yes | — | "basic" / "good" / "high" |
| singing_styles | jsonb | Yes | `'[]'` | |
| singing_sample_url | text | Yes | — | |
| voice_sample_url | text | Yes | — | |
| image_url | text | Yes | — | |
| youtube_link | text | Yes | — | |
| notes | text | Yes | — | |
| raw_payload | jsonb | No | — | Full form snapshot |
| review_status | text | No | `'pending'` | |
| match_status | text | No | `'pending'` | |
| matched_actor_id | text | Yes | — | FK → actors.id |
| accents | jsonb | Yes | `'[]'` | |
| merge_report | jsonb | Yes | — | |
| deleted_at | timestamptz | Yes | — | Soft delete |
| created_at | timestamptz | No | now() | |

**RLS:** Public INSERT allowed. SELECT/UPDATE/DELETE restricted (restrictive policies with `true` — effectively admin-only via service role).

### Table: `actors` (Internal management)

Used by the internal app. The external form does NOT write to this table directly.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | text | No | gen_random_uuid()::text |
| full_name | text | No | — |
| phone | text | No | — |
| email | text | Yes | `''` |
| gender | text | No | — |
| birth_year | integer | No | — |
| vat_status | text | No | — |
| city | text | Yes | `''` |
| dubbing_experience_years | integer | Yes | 0 |
| is_course_grad | boolean | Yes | false |
| is_singer | boolean | Yes | false |
| singing_level | text | Yes | `''` |
| singing_styles | jsonb | Yes | `'[]'` |
| singing_styles_other | jsonb | Yes | `'[]'` |
| singing_sample_url | text | Yes | `''` |
| voice_sample_url | text | Yes | `''` |
| image_url | text | Yes | `''` |
| youtube_link | text | Yes | `''` |
| languages | jsonb | Yes | `'[]'` |
| other_lang_text | text | Yes | `''` |
| skills | jsonb | Yes | `'[]'` |
| accents | jsonb | Yes | `'[]'` |
| notes | text | Yes | `''` |
| is_draft | boolean | Yes | false |
| created_at | timestamptz | Yes | now() |
| updated_at | timestamptz | Yes | now() |

### Storage

- **Bucket:** `actor-submissions` (public)
- **Folders:** `images/`, `audio/`
- **File naming:** `{folder}/{uuid}-{timestamp}.{ext}`
- **Max size:** 10MB

---

## Key Components

| File | Purpose |
|------|---------|
| `src/components/intake/ActorIntakeForm.tsx` | Main form (758 lines) |
| `src/components/intake/FormSection.tsx` | Collapsible card section wrapper |
| `src/components/intake/ChipSelect.tsx` | Multi-select chip/tag component |
| `src/components/intake/FileUpload.tsx` | Image/audio file upload with preview |
| `src/components/intake/AudioInput.tsx` | Audio recorder + file upload combo |
| `src/components/intake/SuccessScreen.tsx` | Post-submission success view |
| `src/hooks/use-audio-recorder.ts` | Browser audio recording hook (2min max) |
| `src/lib/file-upload.ts` | Supabase storage upload + validation |
| `src/lib/form-utils.ts` | Email/phone normalization & validation |
| `src/lib/logger.ts` | Console logger wrapper |

---

## Recent Changes (Changelog)

### Languages expansion (latest)
- Added ספרדית, גרמנית, איטלקית to LANGUAGES constant
- Synced with internal form requirements

### Singing section simplification
- Changed singing styles from "select + level per style" to simple multi-select chips
- Removed per-style level dropdowns
- Other singing styles changed from `{name, level}` objects to plain `string[]`
- Added singing sample AudioInput in media section

### Skills/Accents update
- Replaced old skills list with accent-focused list:
  קריינות, מבטא רוסי/צרפתי/איטלקי/ספרדי/גרמני/אנגלי, כל מבטא אפשרי, אחר

### New fields added
- `city` — text input in personal details
- `dubbingExperienceYears` — number input in experience section
- `studiedAt` — text input for education/course name
- `youtubeLink` — URL input in media section
- `singingSampleFile` — audio record/upload in media section

### Form section reordering
1. Personal Details (was: same)
2. Dubbing Experience (new section)
3. Singing (new section)
4. Skills (was: section 2)
5. Languages — renamed to "שפות בשליטה מלאה" (was: section 3)
6. VAT Status (was: part of personal)
7. Notes
8. Media

### raw_payload enrichment
All new fields stored in `raw_payload` JSONB for data preservation without requiring DB schema changes.

---

## Sync Status with Internal App

The external form (this project) and the internal app share the `actor_submissions` table. Key sync points:

| Feature | External (this) | Internal | Synced? |
|---------|----------------|----------|---------|
| Skills list | ✅ Full accent list | ✅ Same | ✅ |
| Languages | ✅ 9 options | Needs: +אמהרית, יידיש, פורטוגזית, רומנית | ⚠️ Partial |
| Singing (simplified) | ✅ Chips | ✅ Same | ✅ |
| Singing sample | ✅ AudioInput | ✅ Same | ✅ |
| City | ✅ | ✅ | ✅ |
| Dubbing experience | ✅ | ✅ | ✅ |
| YouTube link | ✅ | ✅ | ✅ |
| Course graduate | ✅ | ✅ | ✅ |
| Studied at | ✅ | Needs check | ❓ |

**Note:** The internal app's language list may include אמהרית, יידיש, פורטוגזית, רומנית — these are NOT yet in the external form. This was a deliberate decision to keep the external form concise, but may need syncing in the future.
