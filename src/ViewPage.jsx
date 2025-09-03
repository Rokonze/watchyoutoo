import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YoutubePlayer from "./YoutubePlayer";
import CommentTimeline from "./CommentTimeline";
import Navbar from "./NavBar";
import { supabase } from "./supabaseClient";

export default function ViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [revealedSet, setRevealedSet] = useState(() => new Set());

  const playerRef = useRef(null);

  // Load video + comments
  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("video_comments")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;

        // Sort comments by timestamp
        const sortedData = {
          ...data,
          comments: (data.comments || []).sort(
            (a, b) => Number(a.time) - Number(b.time)
          ),
        };

        setVideoData(sortedData);
      } catch (err) {
        console.error("Error fetching video:", err);
        alert("Could not load video. Maybe the link is invalid.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, navigate]);

  // Poll currentTime once player is ready
  useEffect(() => {
    if (!playerReady) return;
    const interval = setInterval(() => {
      const t = playerRef.current?.getCurrentTime?.() ?? 0;
      setCurrentTime(t);
    }, 300);
    return () => clearInterval(interval);
  }, [playerReady]);

  // Permanently reveal comments whose time has been reached
  useEffect(() => {
    if (!videoData?.comments?.length) return;
    let updated = null;
    for (let i = 0; i < videoData.comments.length; i++) {
      const t = Number(videoData.comments[i].time) || 0;
      if (currentTime >= t && !revealedSet.has(i)) {
        if (!updated) updated = new Set(revealedSet);
        updated.add(i);
      }
    }
    if (updated) setRevealedSet(updated);
  }, [currentTime, videoData, revealedSet]);

  // Compute active comment index (for auto-scroll)
  const activeIndex = useMemo(() => {
    const list = videoData?.comments ?? [];
    if (list.length === 0) return -1;
    for (let i = 0; i < list.length; i++) {
      const cur = Number(list[i].time) || 0;
      const next = i < list.length - 1 ? Number(list[i + 1].time) || 0 : Infinity;
      if (currentTime >= cur && currentTime < next) return i;
    }
    return currentTime >= (Number(list[list.length - 1]?.time) || 0)
      ? list.length - 1
      : -1;
  }, [videoData, currentTime]);



  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }
  if (!videoData) return null;

return (
  <div className="min-h-screen flex flex-col  text-white">
    <Navbar />

    <div className="min-h-full flex flex-col items-center p-4 pb-0 md:pt-6 md:pl-6 gap-4 w-full">
      <div className="w-full md:flex md:gap-6">
        {/* Video + Timeline */}
        <div className="flex-1 flex flex-col items-start w-full">
          <div className="w-full md:w-auto md:px-0">
            <YoutubePlayer
              videoId={videoData.video_id}
              onReady={(player) => {
                        playerRef.current = player;
                        setPlayerReady(true);
                      }}
            />
            {/* Timeline */}
            <div className="w-full mt-2">
              <CommentTimeline
                comments={videoData.comments}
                duration={playerRef.current?.getDuration() ?? 0}
                currentTime={currentTime}
                onSeek={(time) => playerRef.current?.seekTo(time, true)}
              />
            </div>
          </div>

          {/* Comments under the timeline (mobile / small screens) */}
          <div className="flex flex-col gap-2 mt-3 md:hidden border border-gray-700 rounded p-3 max-h-96 overflow-y-auto w-[95%] mx-auto bg-gray-800">
            {videoData.comments.length === 0 ? (
              <p className="text-sm text-gray-400">No comments yet.</p>
            ) : (
              videoData.comments.map((c, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-gray-700 py-2"
                >
                  <div>
                    <span className="text-sm text-gray-400 mr-2">
                      {formatTime(c.time)}
                    </span>
                    <span className={revealedSet.has(i) ? "text-white" : "blur-sm"}>
                      {c.text}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar for md+ screens */}
        <div className="hidden lg:flex lg:flex-col w-80 gap-4">
          <div className="flex-1 border border-gray-700 rounded p-3  h-full max-h-[80vh] overflow-y-auto bg-gray-800">
            {videoData.comments.length === 0 ? (
              <p className="text-sm text-gray-400">No comments yet.</p>
            ) : (
              videoData.comments.map((c, i) => (
                <div
                  key={i}
                  className="mb-2 flex justify-between items-center border-b border-gray-700 py-2"
                >
                  <div>
                    <span className="text-sm text-gray-400 mr-2">
                      {formatTime(c.time)}
                    </span>
                    <span className={revealedSet.has(i) ? "text-white" : "blur-sm"}>
                      {c.text}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}