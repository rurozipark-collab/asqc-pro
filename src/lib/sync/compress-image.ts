export async function compressImageFile(
  file: File,
  maxWidth = 1280,
  quality = 0.72,
): Promise<string> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = objectUrl;
    });

    let { width, height } = image;
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}