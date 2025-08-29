import React from "react"

export default function CommentTimeline({ comments, duration, onSeek, currentTime }) {
  return (
  <div className="relative w-full h-4 bg-gray-800 rounded mt-4">
    {comments.map((comment, i) => {
      const percent = (comment.time / duration) * 100;

      // Highlight marker if near currentTime
      const isActive =
        currentTime !== undefined &&
        currentTime >= comment.time &&
        (i === comments.length - 1 || currentTime < comments[i + 1].time);

      return (
        <div
          key={i}
          onClick={() => onSeek(comment.time)}
          className={`absolute top-0 h-4 w-1 cursor-pointer transform -translate-x-1/2 rounded ${
            isActive ? "bg-red-400" : "bg-yellow-400"
          }`}
          style={{ left: `${percent}%` }}
        ></div>
      );
    })}
  </div>
);
}