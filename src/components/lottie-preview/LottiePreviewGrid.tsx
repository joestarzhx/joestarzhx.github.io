"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import { ThemedLottie } from "@/components/animation/ThemedLottie";
import { Button } from "@/components/ui/Button";
import { lottieItems, type LottieItem } from "@/data/lottie";

export function LottiePreviewGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {lottieItems.map((item) => (
        <PreviewCard item={item} key={item.key} />
      ))}
    </div>
  );
}

function PreviewCard({ item }: { item: LottieItem }) {
  const [nonce, setNonce] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(item.speed);

  return (
    <article className="flex min-h-[440px] flex-col rounded-[22px] border border-[var(--border)] bg-[var(--surface-solid)] p-5">
      <div className="aspect-square overflow-hidden rounded-[18px] bg-[var(--surface-muted)]">
        {playing ? (
          <ThemedLottie
            key={`${item.key}-${nonce}-${speed}`}
            light={item.light}
            dark={item.dark}
            shared={item.shared}
            fallbackSrc={item.fallback}
            loop={item.loop}
            speed={speed}
            className="size-full"
            decorative
            playOnView={false}
          />
        ) : null}
      </div>
      <div className="mt-5 flex-1">
        <h2 className="text-xl font-semibold">{item.name}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
        <dl className="mt-4 grid gap-2 text-xs text-[var(--text-secondary)]">
          <div className="flex justify-between gap-3">
            <dt>位置</dt>
            <dd>{item.placement}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>循环</dt>
            <dd>{item.loop ? "是" : "否"}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => setPlaying(true)}>
          <Play size={15} /> 播放
        </Button>
        <Button type="button" variant="secondary" onClick={() => setPlaying(false)}>
          <Pause size={15} /> 暂停
        </Button>
        <Button type="button" variant="secondary" onClick={() => setNonce((value) => value + 1)}>
          <RotateCcw size={15} /> 重播
        </Button>
        {[0.5, 1, 1.5].map((value) => (
          <Button type="button" variant={speed === value ? "primary" : "secondary"} onClick={() => setSpeed(value)} key={value}>
            {value}x
          </Button>
        ))}
      </div>
    </article>
  );
}
