"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ForwardIcon,
  PlayIcon,
  RewindIcon,
  UploadIcon,
  PauseIcon,
} from "lucide-react";
import Image from "next/image";

interface Track {
  title: string;
  artist: string;
  src: string;
}

const AudioPlayer: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newTracks: Track[] = Array.from(files).map((file) => ({
        title: file.name,
        artist: "Unknown Artist",
        src: URL.createObjectURL(file),
      }));
      setTracks((prevTracks) => [...prevTracks, ...newTracks]);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = tracks[currentTrackIndex]?.src || "";
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-gray-900 p-6">
      <div className="w-full max-w-2xl p-8 rounded-lg shadow-2xl bg-gray-900 border border-gray-600 transition-all hover:border-yellow-500 hover:shadow-yellow-500/50">
        <div className="flex items-center justify-between text-yellow-300 mb-6">
          <h1 className="text-3xl font-extrabold animate-bounce">🎶 Audio Player</h1>
          <label className="flex items-center cursor-pointer text-lg hover:text-indigo-200 transition-colors">
            <UploadIcon className="w-6 h-6 mr-2" />
            <span>Upload</span>
            <input
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
        <Card className="shadow-lg rounded-lg bg-white/10 backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-105">
          <CardContent className="flex flex-col items-center justify-center gap-6 p-10">
            <Image
              src="/music.svg"
              alt="Album Cover"
              width={120}
              height={120}
              className="rounded-full w-40 h-40 object-cover animate-pulse"
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">
                {tracks[currentTrackIndex]?.title || "Audio Title"}
              </h2>
              <p className="text-indigo-200">
                {tracks[currentTrackIndex]?.artist || "Unknown Artist"}
              </p>
            </div>
            <div className="w-full">
              <Progress value={progress} className="bg-indigo-200" />
              <div className="flex justify-between text-sm text-white/80">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevTrack}
                className="hover:text-indigo-200 transition-colors"
              >
                <RewindIcon className="w-8 h-8 transition-transform hover:scale-125" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="hover:text-indigo-200 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="w-8 h-8 transition-transform hover:scale-125" />
                ) : (
                  <PlayIcon className="w-8 h-8 transition-transform hover:scale-125" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextTrack}
                className="hover:text-indigo-200 transition-colors"
              >
                <ForwardIcon className="w-8 h-8 transition-transform hover:scale-125" />
              </Button>
            </div>
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </CardContent>
        </Card>
      </div>
      {/* Footer section */}
      <footer className="mt-4 text-sm text-gray-400 text-center">
        Created By <span className="text-yellow-300">{`Ismail Ahmed Shah`}</span>
      </footer>
    </div>
  );
}

export default AudioPlayer;
