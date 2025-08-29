import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"

export default function EmojiInput({ value, onChange, onSend }) {
  
  const [open, setOpen] = useState(false);
    const pickerRef = useRef(null);

    useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);
    
  
   const handleEmojiClick = (emojiData) => {
    const char = emojiData?.emoji || emojiData?.native || "";
    onChange(value + char);
    
  };

  return (
    <div className="relative flex flex-col gap-2">
      {/* Input + buttons row */}
      <div className="flex gap-2">
        <Input
          placeholder="Write a comment..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={"text-gray-700"}
        />
        <Button
          variant="outline"
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-4xl"
          type="button"
          onClick={() => setOpen((o) => !o)}
        >
          😀
        </Button>
        <Button  className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded" type="button" onClick={onSend}>
          Send
        </Button>
      </div>

      {/* Emoji Picker */}
      {open && (
        <div ref={pickerRef} className="absolute top-full z-50 mt-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}