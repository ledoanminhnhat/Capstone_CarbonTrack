import type { UploadKind, UploadSignature } from "@/types";
import { request } from "./http";

/** Xin chữ ký từ backend rồi upload thẳng lên Cloudinary; trả về URL ảnh. */
export async function uploadImage(file: File, kind: UploadKind = "post"): Promise<string> {
  const sig = await request<UploadSignature>(`/api/uploads/signature?type=${kind}`, { method: "POST" });

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);
  form.append("allowed_formats", sig.allowedFormats);
  form.append("transformation", sig.transformation);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error?.message || "Image upload failed");
  return body.secure_url as string;
}
