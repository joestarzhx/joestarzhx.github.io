"use client";

import Image from "next/image";
import { useState } from "react";
import { ProjectImageFallback } from "@/components/project/ProjectImageFallback";

type ProjectImageProps = {
  src: string;
  alt: string;
  title: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  imageClassName?: string;
};

export function ProjectImage({
  src,
  alt,
  title,
  className = "",
  sizes,
  priority = false,
  imageClassName = "object-cover",
}: ProjectImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={className}>
      {failed ? (
        <ProjectImageFallback title={title} />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={imageClassName}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
