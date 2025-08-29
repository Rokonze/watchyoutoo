
import YoutubePlayer from "./YoutubePlayer";
import CopyButton from "./CopyButton";
import CommentBox from "./CommentBox";
import Navbar from "./NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Button } from "./components/ui/button";
import { supabase } from "./supabaseClient";

export default function EditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoUrl = location.state?.videoUrl || "";

  const [comments, setComments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [shareLink, setShareLink] = useState("");

  const playerRef = useRef(null);

  const getVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }
      return urlObj.searchParams.get("v");
    } catch {
      return null;
    }
  };

  const videoId = getVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500">Invalid YouTube URL.</p>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </div>
    );
  }

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("videoComments") || "{}");
    if (stored[videoId]) {
      setComments(stored[videoId]);
    }
  }, [videoId]);

  const getCurrentTime = () => playerRef.current?.getCurrentTime?.() ?? 0;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  const handleAddComment = (comment) => {
    setComments((prev) => {
      const newComments = [...prev, comment];
      const stored = JSON.parse(localStorage.getItem("videoComments") || "{}");
      stored[videoId] = newComments;
      localStorage.setItem("videoComments", JSON.stringify(stored));
      return newComments;
    });
  };

  const handleDelete = (index) => {
    setComments((prev) => {
      const newComments = prev.filter((_, i) => i !== index);
      const stored = JSON.parse(localStorage.getItem("videoComments") || "{}");
      stored[videoId] = newComments;
      localStorage.setItem("videoComments", JSON.stringify(stored));
      return newComments;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("video_comments")
        .insert([
          {
            video_id: videoId,
            video_url: videoUrl,
            comments: comments,
          },
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const id = data[0].id;
        setShareLink(`${window.location.origin}/view/${id}`);
        alert("Saved! Shareable link copied to the input below.");
      }
    } catch (err) {
      console.error("Error saving:", err);
      alert("Failed to save. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
  <div className="h-screen flex flex-col bg-gray-100 text-white">
    <Navbar />

    <div className="flex-1 flex flex-col md:flex-row gap-4 p-4">
      {/* Video Section */}
      <div className="flex-1">
        <YoutubePlayer
          videoId={videoId}
          onReady={(player) => (playerRef.current = player)}
        />
      </div>

      {/* Comments & Controls */}
      <div className="flex flex-col w-full md:w-80 gap-4">
        {/* Controls: Save, Share, Add Comment */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>

          {shareLink && <CopyButton link={shareLink} />}

          <CommentBox
            onAdd={(item) => handleAddComment(item)}
            getCurrentTime={getCurrentTime}
          />
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto border border-gray-700 rounded p-3 min-h-[30vh] lg:max-h-[67vh] bg-gray-800">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-400">No comments yet.</p>
          ) : (
            comments.map((c, i) => (
              <div
                key={i}
                className="mb-2 flex justify-between items-center border-b border-gray-700 py-2"
              >
                <div>
                  <span className="text-sm text-gray-400 mr-2">
                    {formatTime(c.time)}
                  </span>
                  <span>{c.text}</span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-600 hover:bg-red-500 text-white"
                  onClick={() => handleDelete(i)}
                >
                  X
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);
}