import { useState } from "react";
import AuthScreen from "./AuthScreen";
import { supabase } from "@/lib/supabase";

export default function AuthParent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      if (isLoginMode) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message || "An error occurred during authentication.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthScreen
      email={email} setEmail={setEmail}
      password={password} setPassword={setPassword}
      isLoginMode={isLoginMode} setIsLoginMode={setIsLoginMode}
      authLoading={authLoading} authError={authError}
      handleAuth={handleAuth}
    />
  );
}