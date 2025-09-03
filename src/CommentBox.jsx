import { useState } from "react";
import EmojiInput from "./EmojiInput";



export default function CommentBox({ onAdd, getCurrentTime }) {
  const [text, setText] = useState("");
  

   const handleSend = () => {
    if (!text.trim()) return;
    const time = Math.floor((getCurrentTime?.() ?? 0));
    onAdd({ text, time });
    setText("");
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