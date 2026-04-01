import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { Slide } from './narrationScripts';

function getAudioUrl(sectionId: number): string {
  return `${import.meta.env.BASE_URL}audio/section-${sectionId}.mp3`;
}

type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export function useVideoPlayback(sectionId: number, slides: Slide[]) {
  const [playerState, setPlayerState] = useState<PlayerState>('idle');
  const [manualSlide, setManualSlide] = useState<number | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSlides = slides.length;

  const slideDurations = useMemo(() => {
    const BASE_WEIGHT = 8;
    const weights = slides.map((s) => BASE_WEIGHT + s.bullets.length + (s.code ? 2 : 0));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    return weights.map((w) => w / totalWeight);
  }, [slides]);

  const derivedSlide = useMemo(() => {
    if (playerState !== 'playing' && playerState !== 'paused') return 0;
    let sum = 0;
    for (let i = 0; i < slideDurations.length; i++) {
      sum += slideDurations[i];
      if (audioProgress < sum) return i;
    }
    return slideDurations.length - 1;
  }, [audioProgress, playerState, slideDurations]);

  const currentSlide = manualSlide ?? derivedSlide;

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const startPlayback = useCallback(async () => {
    setPlayerState('loading');
    setErrorMsg('');

    try {
      const url = getAudioUrl(sectionId);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.addEventListener('ended', () => {
        setPlayerState('ended');
        setAudioProgress(1);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      });

      audio.addEventListener('error', () => {
        setPlayerState('error');
        setErrorMsg('Audio file not found.');
      });

      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('canplaythrough', () => resolve(), { once: true });
        audio.addEventListener('error', () => reject(new Error('Audio file not found')), { once: true });
        audio.load();
      });

      await audio.play();
      setPlayerState('playing');
      setManualSlide(null);

      progressIntervalRef.current = setInterval(() => {
        if (audio.duration && audio.duration > 0) {
          setAudioProgress(audio.currentTime / audio.duration);
        }
      }, 200);
    } catch (err) {
      setPlayerState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load audio.');
    }
  }, [sectionId]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playerState === 'playing') {
      audio.pause();
      setPlayerState('paused');
    } else if (playerState === 'paused') {
      audio.play();
      setPlayerState('playing');
    } else if (playerState === 'ended') {
      audio.currentTime = 0;
      audio.play();
      setPlayerState('playing');
      setManualSlide(null);
    }
  }, [playerState]);

  const goToSlide = useCallback(
    (index: number) => {
      setManualSlide(index);

      const audio = audioRef.current;
      if (audio && audio.duration) {
        let targetTime = 0;
        for (let i = 0; i < index; i++) {
          targetTime += slideDurations[i];
        }
        audio.currentTime = targetTime * audio.duration;
        setAudioProgress(targetTime);
      }
    },
    [slideDurations],
  );

  const goNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
  }, [currentSlide, totalSlides, goToSlide]);

  const goPrev = useCallback(() => {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  return {
    playerState,
    currentSlide,
    totalSlides,
    audioProgress,
    errorMsg,
    startPlayback,
    togglePlayPause,
    goToSlide,
    goNext,
    goPrev,
  } as const;
}
