const MAX_PHOTO = 1_000_000;
export async function preparePhoto(file: File): Promise<File> {
  if (file.size > 20_000_000) throw new Error(`${file.name}: please choose a photo smaller than 20 MB.`);
  if (!/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name) && !["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(file.type)) throw new Error(`${file.name}: please choose a JPEG, PNG, or WebP photo.`);
  const url = URL.createObjectURL(file);
  try {
    const image = new window.Image();
    image.src = url;
    try { await image.decode(); } catch { throw new Error(`${file.name}: this photo could not be opened. For HEIC, export or share it as JPEG and try again.`); }
    if (!image.naturalWidth || image.naturalWidth * image.naturalHeight > 50_000_000) throw new Error(`${file.name}: please choose a smaller photo.`);
    let maxEdge = 2400;
    for (let pass = 0; pass < 3; pass++) {
      const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Photo preparation is unavailable in this browser. You can send your request without photos.");
      context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0, canvas.width, canvas.height);
      for (const quality of [.9, .8, .7]) {
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
        if (blob && blob.size <= MAX_PHOTO) return new File([blob], `${file.name.replace(/\.[^.]+$/, "").slice(0, 70)}.jpg`, {type: "image/jpeg"});
      }
      maxEdge = Math.round(maxEdge * .8);
    }
    throw new Error(`${file.name}: please crop the photo closer to the appliance or model label and try again.`);
  } finally {URL.revokeObjectURL(url);}
}
