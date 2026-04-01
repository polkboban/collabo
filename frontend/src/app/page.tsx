"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

// Import our new components
import AuthScreen from "../components/AuthScreen";
import DashboardHeader from "../components/DashboardHeader";
import CampaignInput from "../components/CampaignInput";
import AgentRoom from "../components/AgentRoom";

export default function App() {
  // --- AUTH STATE ---
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- APP STATE ---
  const [sourceMaterial, setSourceMaterial] = useState(
    "We are launching 'CloudBox 2.0'. It's an enterprise storage solution for IT admins. Features: AES-256 encryption, 10TB storage, AI search. It is fast and secure."
  );
  const [tone, setTone] = useState("Engaging & Punchy");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        alert("Check your email for the confirmation link!");
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


  const handleStartProduction = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsCopied(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_material: sourceMaterial, tone: tone }),
      });

      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);

      const data = await response.json();
      
      // We set the FULL object as the result so AgentRoom has access to all pieces
      setResult(data);

      if (user) {
        const { error: dbError } = await supabase.from('campaigns').insert([
          { user_id: user.id, source_material: sourceMaterial, tone: tone, campaign_markdown: data.campaign_markdown }
        ]);
        if (dbError) console.error("Failed to save campaign to database:", dbError);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while connecting to the AI engine.");
    } finally {
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
    // Download the assembled markdown file text
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans selection:bg-blue-500/30">
      <DashboardHeader handleSignOut={handleSignOut} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CampaignInput 
          sourceMaterial={sourceMaterial} setSourceMaterial={setSourceMaterial}
          tone={tone} setTone={setTone} isLoading={isLoading} error={error}
          handleStartProduction={handleStartProduction}
        />
        <AgentRoom 
          isLoading={isLoading} result={result} isCopied={isCopied}
          handleCopy={handleCopy} handleDownload={handleDownload}
        />
      </div>
    </div>
  );
}