import { useState, useRef, useEffect } from "react";
import { Mic, Upload, Square, Play, Pause, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";

interface AudioInputProps {
  value: File | null;
  onChange: (file: File | null) => void;
  helper?: string;
  error?: string;
}

type InputMode = "idle" | "recording" | "upload";

export function AudioInput({ value, onChange, helper, error }: AudioInputProps) {
  const [mode, setMode] = useState<InputMode>("idle");
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    audioUrl,
    error: recorderError,
    isSupported,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
  } = useAudioRecorder();

  // Convert blob to File when recording is complete
  useEffect(() => {
    if (audioBlob && audioUrl && !isRecording) {
      const extension = audioBlob.type.includes("mp4") ? "m4a" : "webm";
      const file = new File([audioBlob], `recording.${extension}`, { type: audioBlob.type });
      onChange(file);
      setMode("idle");
    }
  }, [audioBlob, audioUrl, isRecording, onChange]);

  // Handle audio playback end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  const handleStartRecording = async () => {
    setMode("recording");
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onChange(file);
      setMode("idle");
    }
  };

  const handleClear = () => {
    onChange(null);
    clearRecording();
    setIsPlaying(false);
    setMode("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const fileAccept = "audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a,audio/m4a,audio/ogg,audio/aac,audio/webm";

  // Show error if recorder failed
  if (recorderError && mode === "recording") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-destructive font-medium">{recorderError}</p>
            <p className="text-xs text-muted-foreground mt-1">
              ניתן להעלות קובץ קיים במקום
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMode("idle")}
          >
            חזרה
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFileSelect}
          >
            <Upload className="h-4 w-4 ml-2" />
            העלאת קובץ
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={fileAccept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  // Recording in progress
  if (isRecording) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/30 rounded-lg">
          <div className="recording-indicator">
            <span className="recording-dot" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">מקליט...</p>
            <p className="text-2xl font-mono font-bold text-primary">
              {formatDuration(duration)}
            </p>
            <p className="text-xs text-muted-foreground">מקסימום 2 דקות</p>
          </div>
          <div className="flex gap-2">
            {isPaused ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={resumeRecording}
                title="המשך"
              >
                <Play className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={pauseRecording}
                title="השהה"
              >
                <Pause className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleStopRecording}
              className="gap-2"
            >
              <Square className="h-4 w-4" />
              סיום
            </Button>
          </div>
        </div>
        {helper && <p className="form-helper">{helper}</p>}
      </div>
    );
  }

  // Has file (recorded or uploaded)
  if (value) {
    const previewUrl = audioUrl || URL.createObjectURL(value);
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-3 bg-success-bg border border-success rounded-lg">
          <div className="h-12 w-12 bg-success/10 rounded flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.name}</p>
            <p className="text-xs text-muted-foreground">
              {(value.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePlayPause}
              title={isPlaying ? "עצור" : "נגן"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              title="הסר"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <audio ref={audioRef} src={previewUrl} className="hidden" />
        {helper && !error && <p className="form-helper">{helper}</p>}
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }

  // Idle state - show options
  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={fileAccept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="flex gap-2">
        {isSupported && (
          <button
            type="button"
            onClick={handleStartRecording}
            className={cn(
              "flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed transition-all duration-200",
              "border-border bg-card text-foreground",
              "hover:border-primary/50 hover:bg-primary/5",
              error && "border-destructive"
            )}
          >
            <Mic className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium">להקלטה</span>
          </button>
        )}
        
        <button
          type="button"
          onClick={handleFileSelect}
          className={cn(
            "flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed transition-all duration-200",
            "border-border bg-card text-foreground",
            "hover:border-primary/50 hover:bg-primary/5",
            error && "border-destructive"
          )}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium">להעלאת קובץ</span>
        </button>
      </div>

      {!isSupported && (
        <p className="text-xs text-muted-foreground">
          הדפדפן שלך לא תומך בהקלטה. ניתן להעלות קובץ קיים.
        </p>
      )}

      {helper && !error && <p className="form-helper">{helper}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
