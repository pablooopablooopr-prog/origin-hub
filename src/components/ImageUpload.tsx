import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";

type BucketType = "route-images" | "pack-images" | "product-images" | "company-files";

interface ImageUploadProps {
  bucket: BucketType;
  folder?: string;
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
}

export const ImageUpload = ({
  bucket,
  folder,
  currentImage,
  onImageUploaded,
  onImageRemoved,
  className = "",
  aspectRatio = "video",
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload();
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    const url = await uploadImage(file, bucket, folder);
    if (url) {
      setPreview(url);
      onImageUploaded(url);
    } else {
      setPreview(currentImage || null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageRemoved?.();
  };

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "",
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {preview ? (
        <div className={`relative ${aspectClasses[aspectRatio]} overflow-hidden rounded-lg border border-border`}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {!uploading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`w-full ${aspectClasses[aspectRatio]} min-h-[120px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Haz clic para subir imagen
              </span>
              <span className="text-xs text-muted-foreground">
                JPG, PNG, WebP (máx. 5MB)
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
