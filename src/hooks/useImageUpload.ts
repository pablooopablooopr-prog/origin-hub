import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type BucketType = "route-images" | "pack-images" | "product-images" | "company-files";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (
    file: File,
    bucket: BucketType,
    folder?: string
  ): Promise<string | null> => {
    try {
      setUploading(true);

      // Get current user for folder structure
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para subir imágenes",
          variant: "destructive",
        });
        return null;
      }

      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast({
          title: "Error al subir imagen",
          description: uploadError.message,
          variant: "destructive",
        });
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "No se pudo subir la imagen",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string, bucket: BucketType): Promise<boolean> => {
    try {
      // Extract path from URL
      const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);
      if (urlParts.length < 2) return false;

      const filePath = urlParts[1];
      const { error } = await supabase.storage.from(bucket).remove([filePath]);

      if (error) {
        console.error("Delete error:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Delete error:", error);
      return false;
    }
  };

  return { uploadImage, deleteImage, uploading };
};
