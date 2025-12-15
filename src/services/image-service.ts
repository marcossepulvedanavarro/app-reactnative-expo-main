import { apiFetch } from "@/api/client";

export type UploadedImage = {
  url: string;
  key: string;
  size: number;
  contentType: string;
};

export function getImageService() {
  return {

    upload: (file: { uri: string; name?: string; type?: string }) => {
      const form = new FormData();

   
      form.append("image", {
        uri: file.uri,
        name: file.name ?? "photo.jpg",
        type: file.type ?? "image/jpeg",
      } as any);

      return apiFetch<{ success: boolean; data: UploadedImage }>("/images", {
        method: "POST",
        body: form,
       
      });
    },
  };
}

