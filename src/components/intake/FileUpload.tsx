import { useState, useRef } from "react";
import { Upload, X, Loader2, Image, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  type: "image" | "audio";
  value: File | null;
  onChange: (file: File | null) => void;
  helper?: string;
  error?: string;
}

export function FileUpload({
  type,
  value,
  onChange,
  helper,
  error,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const accept =
    type === "image"
      ? "image/jpeg,image/png,image/webp,image/gif"
      : "audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a,audio/m4a,audio/ogg,audio/aac";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    
    if (file && type === "image") {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleClear = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const Icon = type === "image" ? Image : Music;

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 transition-colors",
            "hover:border-primary hover:bg-primary/5",
            error ? "border-destructive" : "border-border"
          )}
        >
          <Icon className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {type === "image" ? "לחץ להעלאת תמונה" : "לחץ להעלאת קובץ שמע"}
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
          {type === "image" && preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-12 w-12 object-cover rounded"
            />
          ) : (
            <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.name}</p>
            <p className="text-xs text-muted-foreground">
              {(value.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {helper && !error && (
        <p className="text-xs text-muted-foreground">{helper}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}