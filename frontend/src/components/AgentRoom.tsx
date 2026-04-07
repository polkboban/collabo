import { useState, useEffect } from "react";
import { Cpu, CheckCircle2, Copy, Download, Check, Edit3, Eye, RefreshCw, Wand2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AgentRoom({ 
  isLoading, 
  result, 
  setResult, 
  streamMessage, 
  handleRegenerate 
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string>("");
  const [isCopiedLocal, setIsCopiedLocal] = useState(false);

  const formatTabTitle = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    if (result && Object.keys(result).length > 0) {
      if (!activeTabKey || !result[activeTabKey]) {
        setActiveTabKey(Object.keys(result)[0]);
      }
    }
  }, [result, activeTabKey]);

  const handleCopyClick = async () => {
    if (!result || !activeTabKey || !result[activeTabKey]) return;
    await navigator.clipboard.writeText(result[activeTabKey]);
    setIsCopiedLocal(true);
    setTimeout(() => setIsCopiedLocal(false), 2000);
  };

  const handleDownloadClick = () => {
    if (!result || !activeTabKey || !result[activeTabKey]) return;
    const content = result[activeTabKey];
    const title = formatTabTitle(activeTabKey);
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

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeTabKey) return;
    
    setResult((prev: any) => ({
      ...prev,
      [activeTabKey]: e.target.value
    }));
  };

  return (
    <div className="bg-zinc-900/40 p-2 sm:p-6 rounded-3xl shadow-2xl border border-white/5 backdrop-blur-xl flex flex-col h-full ring-1 ring-white/10">
      
      {!isLoading && !result && (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 animate-in fade-in duration-700">
          <div className="p-6 bg-zinc-950/50 border border-white/5 rounded-full mb-6 shadow-2xl">
            <Cpu className="w-12 h-12 text-zinc-700" />
          </div>
          <p className="text-lg font-medium text-zinc-400">Awaiting instructions</p>
          <p className="text-sm mt-2 opacity-60">The agent swarm is standing by.</p>
        </div>
      )}

      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 px-8 animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center w-24 h-24">
              <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-2 border-purple-500 rounded-full animate-spin direction-reverse"></div>
              <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-sm text-indigo-400 bg-indigo-500/10 py-1.5 px-4 rounded-full border border-indigo-500/20">
                System Status: Active
              </span>
              <span className="text-lg font-medium text-zinc-300 animate-pulse mt-2 text-center">
                {streamMessage || "Booting neural pathways..."}
              </span>
            </div>
        </div>
      )}

      {result && !isLoading && (
        <div className="flex-1 flex flex-col h-full min-h-0 animate-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex flex-wrap items-center justify-between mb-6 shrink-0 gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm bg-emerald-500/10 py-2 px-3 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Approved</span>
              </div>
              
              <button onClick={() => handleRegenerate(activeTabKey)} className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-xl transition-all border bg-zinc-950/50 text-zinc-400 hover:text-white hover:bg-zinc-800 border-white/5 group">
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline">Regenerate</span>
              </button>

              <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-xl transition-all border ${isEditing ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-zinc-950/50 text-zinc-400 hover:text-white hover:bg-zinc-800 border-white/5'}`}>
                {isEditing ? <Eye className="w-4 h-4 animate-in zoom-in" /> : <Edit3 className="w-4 h-4 animate-in zoom-in" />}
                <span className="hidden lg:inline">{isEditing ? "Preview" : "Edit"}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={handleCopyClick} className="flex items-center gap-2 text-sm font-medium text-zinc-300 bg-zinc-950 hover:bg-zinc-800 py-2 px-4 rounded-xl transition-all border border-white/10 hover:border-white/20">
                {isCopiedLocal ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{isCopiedLocal ? "Copied" : "Copy"}</span>
              </button>
              
              <button onClick={handleDownloadClick} className="flex items-center gap-2 text-sm font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 py-2 px-4 rounded-xl transition-all border border-indigo-500/20 hover:border-indigo-500/40">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4 overflow-x-auto custom-scrollbar">
            {result && Object.keys(result).map((key) => {
              const isActive = activeTabKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTabKey(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap
                    ${isActive 
                      ? 'bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border'
                    }`}
                >
                  {formatTabTitle(key)}
                </button>
              );
            })}
          </div>
          
          <div className="flex-1 bg-zinc-950/50 border border-white/5 rounded-3xl overflow-hidden shadow-inner flex flex-col relative group">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {result && activeTabKey && result[activeTabKey] && (
              <div className="relative h-full flex flex-col">
                
                {isEditing ? (
                  <textarea
                    className="flex-1 w-full p-8 bg-zinc-950/80 text-zinc-300 font-mono text-sm leading-relaxed resize-none focus:outline-none custom-scrollbar"
                    value={result[activeTabKey]}
                    onChange={handleContentChange}
                    spellCheck={false}
                  />
                ) : (
                  <div className="flex-1 p-8 overflow-y-auto text-zinc-300 prose prose-invert prose-indigo max-w-none custom-scrollbar">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mb-6 tracking-tight" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-white mt-8 mb-4 tracking-tight border-b border-white/5 pb-2" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-medium text-zinc-200 mt-6 mb-3" {...props} />,
                        p: ({node, ...props}) => <p className="mb-5 leading-relaxed text-zinc-400 whitespace-pre-line" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-5 space-y-2 marker:text-indigo-500" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-5 space-y-2 marker:text-indigo-500 font-mono text-sm" {...props} />,
                        li: ({node, ...props}) => <li className="text-zinc-300 pl-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-6 italic text-zinc-400 my-6 bg-indigo-500/5 py-3 pr-4 rounded-r-xl" {...props} />,
                        hr: ({node, ...props}) => <hr className="border-white/5 my-10" {...props} />,
                      }}
                    >
                      {result[activeTabKey]}
                    </ReactMarkdown>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}