import { useState } from "react";
import { Button } from "./components/ui/button";

export default function CopyButton({ link }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      // Reset the state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Could not copy link. Please copy manually.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        readOnly
        value={link}
        className="flex-1 border rounded p-2 text-sm text-gray-700"
      />
      <Button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded" onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</Button>
    </div>
  );
}