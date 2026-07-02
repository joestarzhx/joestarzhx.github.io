"use client";

import Image from "next/image";
import { useState } from "react";

type ProfileCardProps = {
  photo: string;
};

export function ProfileCard({ photo }: ProfileCardProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] shadow-[var(--shadow-soft)]">
      <div className="relative aspect-[4/5] bg-[var(--surface-muted)]">
        {failed ? (
          <div className="grid size-full place-items-center">
            <div className="text-center">
              <p className="text-4xl font-semibold tracking-normal">HZ</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Haoxuan Zhang
              </p>
            </div>
          </div>
        ) : (
          <Image
            src={photo}
            alt="张颢轩个人照片"
            fill
            priority
            sizes="(max-width: 1024px) 360px, 320px"
            className="object-contain object-center"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 grid size-16 place-items-center rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-soft)] backdrop-blur-md">
        <Image
          src="/images/lottie-fallbacks/brand-intro-static.svg"
          alt=""
          width={48}
          height={48}
          aria-hidden="true"
          className="object-contain"
        />
      </div>
    </div>
  );
}
