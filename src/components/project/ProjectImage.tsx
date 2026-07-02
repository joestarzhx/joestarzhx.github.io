"use client";

import { ImageWithLoader } from "@/components/media/ImageWithLoader";

type ProjectImageProps = {
  src: string;
  alt: string;
  title: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  unoptimized?: boolean;
  imageClassName?: string;
};

export function ProjectImage({
  src,
  alt,
  title,
  className = "",
  sizes,
  priority = false,
  unoptimized = false,
  imageClassName = "object-cover",
}: ProjectImageProps) {
  return (
    <div className={className}>
      <ImageWithLoader
        src={src}
        alt={alt || title}
        fill
        priority={priority}
        unoptimized={unoptimized}
        sizes={sizes}
        className={imageClassName}
      />
    </div>
  );
}
