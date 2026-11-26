import { useCallback, useEffect, useRef, useState } from "react";

// Background music: loops, fades in/out, pauses while the tab is hidden.
export function useMusic(backgroundTrack, volume = 0.7) {
  const audioRef = useRef(null), active = useRef(null);
  const fadeT = useRef(0), resume = useRef(false), wantsPlayback = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const fade = useCallback((audio, to, ms, done) => {
    clearInterval(fadeT.current);
    const from = audio.volume, steps = Math.max(1, Math.round(ms / 40)); let step = 0;
    fadeT.current = setInterval(() => {
      step++;
      audio.volume = Math.min(1, Math.max(0, from + (to - from) * (step / steps)));
      if (step >= steps) {
        clearInterval(fadeT.current);
        done?.();
      }
    }, 40);
  }, []);

  const start = useCallback((audio) => {
    if (!audio || !audio.paused) return;
    audio.volume = 0;
    audio.play()
      .then(() => {
        if (active.current === audio) {
          setPlaying(true);
          fade(audio, volume, 1800);
        }
      })
      .catch(() => {
        if (active.current === audio) setPlaying(false);
      });
  }, [fade, volume]);

  useEffect(() => {
    if (!backgroundTrack?.src) return;
    const audio = new Audio(backgroundTrack.src);
    audio.loop = true; audio.preload = "auto";
    audioRef.current = audio;
    active.current = audio;

    const updateTime = () => setCurrentTime(audio.currentTime || 0);
    const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);

    return () => {
      clearInterval(fadeT.current);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.pause();
      audioRef.current = null; active.current = null;
    };
  }, [backgroundTrack?.src]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        resume.current = wantsPlayback.current;
        clearInterval(fadeT.current);
        active.current?.pause();
        setPlaying(false);
      } else if (resume.current && wantsPlayback.current) {
        resume.current = false;
        start(active.current);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [start]);

  const play = useCallback(() => {
    wantsPlayback.current = true;
    resume.current = false;
    start(active.current);
  }, [start]);

  const pause = useCallback(() => {
    wantsPlayback.current = false;
    resume.current = false;
    const audio = active.current;
    if (!audio || audio.paused) { setPlaying(false); return; }
    fade(audio, 0, 500, () => audio.pause());
    setPlaying(false);
  }, [fade]);

  const toggle = useCallback(() => {
    if (wantsPlayback.current) pause();
    else play();
  }, [play, pause]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(time)) return;
    audio.currentTime = Math.max(0, Math.min(time, Number.isFinite(audio.duration) ? audio.duration : time));
    setCurrentTime(audio.currentTime);
  }, []);

  return {
    enabled: !!backgroundTrack?.src,
    playing,
    play,
    pause,
    toggle,
    track: backgroundTrack,
    currentTime,
    duration,
    seek
  };
}
