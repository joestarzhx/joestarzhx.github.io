"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";

type ProjectVideoPreviewProps = {
  title: string;
  webm?: string;
  mp4?: string;
  poster?: string;
};

export function ProjectVideoPreview({ title, webm, mp4, poster }: ProjectVideoPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(wrapperRef, { margin: "-120px" });
  const reducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(webm || mp4);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!inView || reducedMotion) {
      video.pause();
    }
  }, [inView, reducedMotion]);

  if (!hasVideo) return null;

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)]"
    >
      <video
        ref={videoRef}
        className="aspect-video w-full bg-[var(--surface-muted)] object-cover"
        aria-label={`${title} 项目视频预览`}
        poster={poster}
        muted
        playsInline
        preload={inView ? "metadata" : "none"}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        {mp4 ? <source src={mp4} type="video/mp4" /> : null}
      </video>
      <div className="flex items-center justify-between gap-4 p-4">
        <p className="text-sm text-[var(--text-secondary)]">项目短预览</p>
        <Button
          type="button"
          variant="secondary"
          className="rounded-[14px]"
          ariaLabel={playing ? `暂停${title}视频预览` : `播放${title}视频预览`}
          onClick={togglePlayback}
        >
          {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          {playing ? "暂停" : "播放"}
        </Button>
      </div>
    </div>
  );
}
