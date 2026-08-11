"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "@/niemeyer/components";
import { getLessonAccessUrl } from "@/lib/actions/progress";

export function LessonVideoPlayer({
  lessonId,
  onAutoComplete,
}: {
  lessonId: string;
  onAutoComplete: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    getLessonAccessUrl(lessonId, "stream")
      .then(({ url: signed }) => {
        if (!cancelled) setUrl(signed);
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
          toast("Não foi possível carregar o vídeo.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  function fireAutoComplete() {
    if (firedRef.current) return;
    firedRef.current = true;
    onAutoComplete();
  }

  if (failed) {
    return <p className="mt-3 text-xs text-destructive">Não foi possível carregar o vídeo. Tente de novo.</p>;
  }

  if (!url) {
    return <p className="mt-3 text-xs text-neutral-500">Carregando vídeo…</p>;
  }

  return (
    <div className="mt-3 w-full">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        controls
        autoPlay
        className="w-full rounded-lg bg-black"
        src={url}
        onEnded={fireAutoComplete}
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          if (video.duration && video.duration - video.currentTime <= 1) fireAutoComplete();
        }}
      />
    </div>
  );
}
