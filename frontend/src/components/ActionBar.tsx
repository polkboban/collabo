import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";

export default function ActionBar({ content, title }: { content: string, title: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <button
        onClick={handleCopy}
        className="p-2 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-md border border-white/10 rounded-lg text-zinc-400 hover:text-zinc-100 transition-all duration-200"
        title="Copy to clipboard"
      >
        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
      
      <button
        onClick={handleDownload}
        className="p-2 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-md border border-white/10 rounded-lg text-zinc-400 hover:text-zinc-100 transition-all duration-200"
        title="Download Markdown"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}