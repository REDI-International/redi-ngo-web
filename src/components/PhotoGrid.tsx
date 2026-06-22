import Image from "next/image";
import type { GalleryPhoto } from "@/content/media";

export function PhotoGrid({ photos }: { photos: GalleryPhoto[] }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {photos.map((photo, i) => (
        <figure
          key={`${photo.src}-${i}`}
          className="mb-4 break-inside-avoid overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5"
        >
          <div className="relative aspect-auto">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={600}
              className="h-auto w-full object-cover transition duration-300 hover:scale-[1.02]"
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
            />
          </div>
          {photo.caption && (
            <figcaption className="px-4 py-3 text-sm text-text-muted">{photo.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

export function PhotoStrip({ photos }: { photos: GalleryPhoto[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
      {photos.map((photo, i) => (
        <div
          key={`${photo.src}-${i}`}
          className="relative h-48 w-72 shrink-0 snap-start overflow-hidden rounded-xl sm:h-56 sm:w-80"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover"
            sizes="320px"
          />
          {photo.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-xs font-medium text-white line-clamp-2">{photo.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
