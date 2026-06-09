'use client';

import { useRef } from 'react';
import { Camera, X, ImageIcon, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/use-translation';
import { compressImageFile } from '@/lib/sync/compress-image';

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onChange, maxPhotos = 5 }: PhotoUploadProps) {
  const { t } = useTranslation();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: FileList | null) => {
    if (!files) return;

    const remaining = maxPhotos - photos.length;
    const toProcess = Array.from(files).slice(0, remaining);
    const nextPhotos = [...photos];

    for (const file of toProcess) {
      if (!file.type.startsWith('image/')) continue;
      try {
        nextPhotos.push(await compressImageFile(file));
      } catch {
        continue;
      }
    }

    onChange(nextPhotos.slice(0, maxPhotos));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await processFiles(e.target.files);
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => cameraInputRef.current?.click()}
          disabled={photos.length >= maxPhotos}
        >
          <Camera className="h-4 w-4" />
          {t('inspections.takePhoto')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => galleryInputRef.current?.click()}
          disabled={photos.length >= maxPhotos}
        >
          <Images className="h-4 w-4" />
          {t('inspections.pickFromGallery')}
        </Button>
        {photos.length > 0 && (
          <span className="text-xs text-slate-400">
            {photos.length}/{maxPhotos}
          </span>
        )}
        {photos.length >= maxPhotos && (
          <span className="text-xs text-amber-400">{t('inspections.maxPhotos', { n: String(maxPhotos) })}</span>
        )}
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-700 aspect-square">
              <img src={photo} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 rounded-full bg-red-600/90 p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3 text-white" />
              </button>
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-800/30 py-8">
          <div className="text-center text-slate-500">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">{t('inspections.uploadPhotoHint')}</p>
          </div>
        </div>
      )}
    </div>
  );
}