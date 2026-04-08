"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AuthScreen from "@/components/AuthScreen";
import DashboardHeader from "@/components/DashboardHeader";
import CampaignInput from "@/components/CampaignInput";
import AgentRoom from "@/components/AgentRoom";
import CampaignHistory from "@/components/CampaignHistory";
import BrandVoiceModal from "@/components/BrandVoiceModal";
import LandingHero from "@/components/LandingHero";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [sourceMaterial, setSourceMaterial] = useState(
    "We are launching 'CloudBox 2.0'. It's an enterprise storage solution for IT admins. Features: AES-256 encryption, 10TB storage, AI search. It is fast and secure."
  );
  const [tone, setTone] = useState("Engaging & Punchy");
  const [isLoading, setIsLoading] = useState(false);
  const [streamMessage, setStreamMessage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [isBrandVoiceOpen, setIsBrandVoiceOpen] = useState(false);
  const [brandVoice, setBrandVoice] = useState({
    company_name: "",
    target_audience: "",
    custom_rules: ""
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) fetchHistory(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchHistory(session.user.id);
    });

    const savedVoice = localStorage.getItem("collabo_brand_voice");
    if (savedVoice) {
      try {
        setBrandVoice(JSON.parse(savedVoice));
      } catch (e) { console.error("Failed to parse brand voice"); }
    }

    return () => subscription.unsubscribe();
  }, []);

  const fetchHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setHistory(data);
    } else {
      console.error("Failed to fetch history:", error);
    }
  };

  const loadCampaignFromHistory = (campaign: any) => {
    setSourceMaterial(campaign.source_material || "");
    setTone(campaign.tone || "Professional & Trustworthy");
    
    if (!campaign.campaign_markdown) {
      setResult(null);
      setIsHistoryOpen(false);
      return;
    }

    try {
      const parsedResult = JSON.parse(campaign.campaign_markdown);
      setResult(parsedResult);
    } catch (e) {
      const md = campaign.campaign_markdown;
      const parts = md.split('---');
      
      setResult({
        blog_post: parts[0] ? parts[0].replace('# Campaign Kit', '').replace('## Blog Post', '').trim() : "Content missing",
        twitter_thread: parts[1] ? parts[1].replace('## Twitter Thread', '').trim() : "Content missing",
        email_teaser: parts[2] ? parts[2].replace('## Email Teaser', '').trim() : "Content missing"
      });
    }
    
    setIsHistoryOpen(false); 
  };

  

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (isLoginMode) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setResult(null);
  };


  const handleStartProduction = async (selectedChannels: string[], advancedData: any) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setStreamMessage("Connecting to Autonomous Content Factory...");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error("Authentication error: Please log in again.");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/stream-campaign`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          source_material: sourceMaterial, 
          tone: tone,
          channels: selectedChannels,
          advanced_settings: advancedData,
          brand_voice: brandVoice 
        }),
      });

      if (!response.body) throw new Error("No readable stream available.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split("\n");
        
       
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonString = line.substring(6).trim();
            if (!jsonString) continue;

            try {
              const parsedData = JSON.parse(jsonString);
              
              if (parsedData.type === "update") {
                setStreamMessage(parsedData.message);
              } else if (parsedData.type === "complete") {
                setResult(parsedData.data);
                
                if (user) {
                  const { data: insertedData, error: insertError } = await supabase.from('campaigns').insert([
                    { 
                      user_id: user.id, 
                      source_material: sourceMaterial, 
                      tone: tone, 
                      campaign_markdown: JSON.stringify(parsedData.data) 
                    }
                  ]).select(); 

                  if (insertError) {
                    console.error("Supabase Insert Failed:", insertError);
                    setError(`Database Error: ${insertError.message}`);
                  } else {
                    console.log("Successfully saved campaign to history!", insertedData);
                    fetchHistory(user.id);
                  }
                }
              } else if (parsedData.type === "error") {
                setError(parsedData.message);
              }
            } catch (err) {
              console.error("Failed to parse chunk:", jsonString, err);
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while connecting to the AI engine.");
    } finally {
      setIsLoading(false);
      setStreamMessage(null);
    }
  };

  const handleRegenerate = async (tabKey: string) => {
    setIsLoading(true);
    setError(null);
    setStreamMessage(`Initiating targeted regeneration for ${tabKey}...`);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error("Authentication error: Please log in again.");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/stream-regenerate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          source_material: sourceMaterial,
          tone: tone || "Professional & Trustworthy",
          format_type: tabKey,
          brand_voice: brandVoice, 
        }),
      });

      if (!response.body) throw new Error("No response from server");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n"); 

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonString = line.substring(6).trim();
            if (!jsonString) continue;

            try {
              const data = JSON.parse(jsonString);

              if (data.type === "update") {
                setStreamMessage(`[${data.agent}] ${data.message}`);
              } else if (data.type === "complete") {
                
                setResult((prev: any) => ({
                  ...prev,
                  [data.data.format_type]: data.data.content
                }));
                
                setStreamMessage("Regeneration Complete!");
                setIsLoading(false);
              } else if (data.type === "error") {
                throw new Error(data.message);
              }
            } catch (err) {
              console.error("Error parsing stream data:", jsonString, err);
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.campaign_markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.campaign_markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "autonomous_campaign.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (authLoading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  if (!user) {
    return (
      <AuthScreen 
        email={email} setEmail={setEmail} password={password} setPassword={setPassword}
        isLoginMode={isLoginMode} setIsLoginMode={setIsLoginMode}
        authLoading={authLoading} authError={authError} handleAuth={handleAuth}
      />
    );
  }
 
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      
      <div className="absolute inset-0 z-0 h-full w-full bg-zinc-950 pointer-events-none flex justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(#4f4f5640_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        
        {/*<div className="absolute top-[-5%] w-[600px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />*/}
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto p-4 sm:p-8">
        
        <DashboardHeader 
          handleSignOut={handleSignOut} 
          onOpenHistory={() => setIsHistoryOpen(true)} 
          onOpenBrandVoice={() => setIsBrandVoiceOpen(true)} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          <div className="lg:col-span-4 sticky top-8">
            <CampaignInput 
              sourceMaterial={sourceMaterial} setSourceMaterial={setSourceMaterial}
              tone={tone} setTone={setTone} isLoading={isLoading} error={error}
              handleStartProduction={handleStartProduction}
            />
          </div>
          <div className="lg:col-span-8 h-[calc(100vh-12rem)]">
            <AgentRoom 
              isLoading={isLoading} result={result} setResult={setResult}
              isCopied={isCopied} streamMessage={streamMessage}
              handleCopy={handleCopy} handleDownload={handleDownload} handleRegenerate={handleRegenerate}
            />
          </div>
        </div>
      </div>
      {isBrandVoiceOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
            onClick={() => setIsBrandVoiceOpen(false)} 
          />
          <BrandVoiceModal 
            brandVoice={brandVoice} setBrandVoice={setBrandVoice} onClose={() => setIsBrandVoiceOpen(false)} 
          />
        </>
      )}

      {isHistoryOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
            onClick={() => setIsHistoryOpen(false)}
          />
          <CampaignHistory 
            history={history} onClose={() => setIsHistoryOpen(false)} onLoad={loadCampaignFromHistory} 
          />
        </>
      )}
    </div>
  );
  
 return <LandingHero />;
}