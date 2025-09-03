import { useState, useEffect } from "react";
import YouTube from "react-youtube";

export default function YoutubePlayer({ videoId, onReady }) {
  
  const getInitialSize = () => {
  const width = Math.min(window.innerWidth * 0.95, 1024);
  return { width, height: (width * 9) / 16 };
  };
  const [playerSize, setPlayerSize] = useState(getInitialSize);

  useEffect(() => {
    function handleResize() {
      const width = Math.min(window.innerWidth * 0.95, 1024); // 95% of screen width on small screens
      const height = (width * 9) / 16;
      setPlayerSize({ width, height });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <YouTube
      videoId={videoId}
      opts={{
        width: playerSize.width,
        height: playerSize.height,
        playerVars: { modestbranding: 1, controls: 1 },
      }}
      onReady={(event) => onReady?.(event.target)}
    />
  );
}