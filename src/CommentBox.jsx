import { useState } from "react";
import EmojiInput from "./EmojiInput";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";


export default function CommentBox({ onAdd, getCurrentTime }) {
  const [text, setText] = useState("");
  

   const handleSend = () => {
    if (!text.trim()) return;
    const time = Math.floor((getCurrentTime?.() ?? 0));
    onAdd({ text, time });
    setText("");
  };

  const handleEmojiClick = (emojiData /*, event */) => {
    // Supports common shapes from emoji-picker-react (v4+)
    const char = emojiData?.emoji || emojiData?.native || "";
    setText((t) => t + char);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <EmojiInput
        value={text}
        onChange={setText}
        onSend={handleSend}
      />
    </div>
  );
}