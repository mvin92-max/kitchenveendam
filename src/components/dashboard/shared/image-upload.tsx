"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, ImageOff, Link2, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  /** Matches a FOLDER_SECTIONS key in src/app/api/upload/route.ts, which gates who may upload where. */
  folder?: "menu" | "events" | "gallery";
  /** Reports the optimized image's actual pixel size (see /api/upload) — used by the gallery to size masonry tiles correctly. */
  onMeta?: (meta: { width: number; height: number }) => void;
};

/** Drag-and-drop uploader with a manual-URL fallback. Posts to /api/upload (see that route's comment re: Cloudinary). */
export function ImageUpload({ value, onChange, folder = "menu", onMeta }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload mislukt");
        return;
      }
      onChange(data.url);
      if (data.width && data.height) onMeta?.({ width: data.width, height: data.height });
    } catch {
      setError("Upload mislukt. Probeer het opnieuw.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void uploadFile(file);
        }}
        className={cn(
          "relative flex h-40 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed bg-white/[0.02] text-center transition-colors",
          dragOver ? "border-kitchen-gold/70 bg-kitchen-gold/5" : "border-white/15 hover:border-white/25",
        )}
      >
        {value ? (
          <Image src={value} alt="Voorvertoning" fill className="object-cover" unoptimized />
        ) : (
          <>
            <Upload size={22} className="text-white/40" />
            <p className="px-4 text-xs text-white/40">
              Sleep een foto hierheen of klik om te bladeren
            </p>
          </>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 size={22} className="animate-spin text-kitchen-gold" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadFile(file);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => setUrlMode((v) => !v)}
        className="flex items-center gap-1.5 self-start text-xs font-medium text-white/50 transition-colors hover:text-kitchen-gold"
      >
        <Link2 size={12} />
        {urlMode ? "Verberg URL-veld" : "Of plak een afbeeldings-URL"}
      </button>

      {urlMode && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="h-10 w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-kitchen-gold/60"
        />
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle size={13} /> {error}
        </p>
      )}
      {!value && !error && (
        <p className="flex items-center gap-1.5 text-xs text-white/30">
          <ImageOff size={12} /> Nog geen foto gekozen
        </p>
      )}
    </div>
  );
}
