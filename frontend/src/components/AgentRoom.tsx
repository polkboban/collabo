import { useState } from "react";
import { Factory, Loader2, CheckCircle, Copy, Download, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AgentRoom({ isLoading, result, isCopied, handleCopy, handleDownload }: any) {
  const [activeTab, setActiveTab] = useState<'blog' | 'twitter' | 'email'>('blog');

  const getActiveContent = () => {
    if (!result) return "";
    if (activeTab === 'blog') return result.blog_post;
    if (activeTab === 'twitter') return result.twitter_thread;
    return result.email_teaser;
  };

  return (
    <div className="bg-zinc-900/50 p-6 rounded-2xl shadow-xl border border-white/5 backdrop-blur-sm flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-4 text-white flex items-center gap-2">
        <Factory className="w-5 h-5 text-blue-400" />
        The Agent Room
      </h2>
      
      {!isLoading && !result && (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
          <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl mb-4 shadow-inner">
            <Factory className="w-12 h-12 text-zinc-700" />
          </div>
          <p>Upload source material to begin production.</p>
        </div>
      )}

      {isLoading && (
        <div className="flex-1 flex flex-col justify-center space-y-4 px-4 sm:px-8">
            <div className="flex items-center gap-4 text-blue-400 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl shadow-sm">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium">Lead Researcher is analyzing facts...</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400 bg-zinc-950/50 border border-white/5 p-4 rounded-xl shadow-inner">
              <Loader2 className="w-6 h-6" />
              <span>Creative Copywriter is drafting...</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400 bg-zinc-950/50 border border-white/5 p-4 rounded-xl shadow-inner">
              <Loader2 className="w-6 h-6" />
              <span>Editor-in-Chief is auditing tone...</span>
            </div>
        </div>
      )}

      {result && !isLoading && (
        <div className="flex-1 flex flex-col h-full min-h-0">
          
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm bg-emerald-500/10 py-2 px-3 rounded-lg border border-emerald-500/20 shadow-sm">
              <CheckCircle className="w-4 h-4" />
              Approved
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="flex items-center gap-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white py-2 px-3 rounded-lg transition-all border border-white/5">
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {isCopied ? "Copied!" : "Copy All"}
              </button>
              <button onClick={handleDownload} className="flex items-center gap-2 text-sm font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 hover:text-blue-300 py-2 px-3 rounded-lg transition-all border border-blue-500/20">
                <Download className="w-4 h-4" />
                Export .md
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4 bg-zinc-950 p-1 rounded-xl border border-white/5 shrink-0">
            <button onClick={() => setActiveTab('blog')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'blog' ? 'bg-zinc-800 text-white shadow-sm border border-white/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}>📝 Blog Post</button>
            <button onClick={() => setActiveTab('twitter')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'twitter' ? 'bg-zinc-800 text-white shadow-sm border border-white/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}>📱 Social Thread</button>
            <button onClick={() => setActiveTab('email')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'email' ? 'bg-zinc-800 text-white shadow-sm border border-white/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}>✉️ Email Teaser</button>
          </div>
          
          <div className="flex-1 p-6 bg-zinc-950 border border-white/10 rounded-xl overflow-y-auto shadow-inner text-zinc-300">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-8 mb-4 first:mt-0" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mt-6 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed whitespace-pre-line" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-blue-500" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-blue-500" {...props} />,
                li: ({node, ...props}) => <li className="text-zinc-300" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-zinc-400 my-4 bg-blue-500/5 py-2 pr-2 rounded-r" {...props} />,
                hr: ({node, ...props}) => <hr className="border-white/10 my-8" {...props} />,
              }}
            >
              {getActiveContent()}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}