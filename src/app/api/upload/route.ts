import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { canAccessSection, type DashboardSection } from "@/lib/permissions";

/**
 * Uploads go straight to Cloudinary. Optimization (resize to a sensible max
 * width, re-compress, format conversion) is delegated to Cloudinary's own
 * upload-time transformation rather than a local Sharp pass — one less
 * moving part, and Cloudinary's `f_auto`/`q_auto` beats a fixed JPEG quality.
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 1600;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/** Which dashboard section is allowed to upload into which folder. */
const FOLDER_SECTIONS: Record<string, DashboardSection> = {
  menu: "menukaart",
  events: "evenementen",
  gallery: "galerij",
};

export async function POST(request: Request) {
  const session = await auth();

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string) || "menu";

  const requiredSection = FOLDER_SECTIONS[folder];
  if (!requiredSection || !session?.user || !canAccessSection(session.user.role, requiredSection)) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Geen bestand ontvangen" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Alleen JPG, PNG, WEBP of GIF-afbeeldingen zijn toegestaan" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Bestand is groter dan 5MB" }, { status: 400 });
  }

  const inputBytes = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{ secure_url: string; width: number; height: number }>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `kitchenveendam/${folder}`,
          resource_type: "image",
          transformation:
            file.type === "image/gif"
              ? undefined
              : [{ width: MAX_DIMENSION, height: MAX_DIMENSION, crop: "limit" }, { fetch_format: "auto", quality: "auto" }],
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload gaf geen resultaat terug"));
            return;
          }
          resolve({
            secure_url: uploadResult.secure_url,
            width: uploadResult.width,
            height: uploadResult.height,
          });
        },
      );
      uploadStream.end(inputBytes);
    },
  );

  return NextResponse.json({
    url: result.secure_url,
    width: result.width,
    height: result.height,
  });
}
