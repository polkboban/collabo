"use client";

import { motion } from "framer-motion";
import { Cpu, User, CheckCircle2, Layers } from "lucide-react";

const CHAT_SEQUENCE = [
  {
    id: 1,
    role: "user",
    text: "I just finished a messy 30-minute webinar on zero-trust architecture. Turn this raw transcript into a Blog Post, a Twitter Thread, and an Email Teaser.",
  },
  {
    id: 2,
    role: "system",
    icon: Layers,
    text: "Ingesting source material. Analyzing tone and extracting key insights...",
  },
  {
    id: 3,
    role: "system",
    icon: Cpu,
    text: "Swarm deployed. Brand tone set to 'Technical & Authoritative'. Delegating tasks to specialized agents.",
  },
  {
    id: 4,
    role: "success",
    icon: CheckCircle2,
    text: "Production complete. Your campaign is formatted, synced, and ready for review in the Agent Room.",
  }
];

export default function LandingChat() {
  return (
    <section className="relative w-full bg-zinc-950 mx-auto px-4 sm:px-6 lg:px-8 py-32 z-30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        
        {/* Left Side: Sticky Copy */}
        <div className="lg:sticky lg:top-40 space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white"
          >
            Want something done? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              The swarm will handle it.
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 leading-relaxed max-w-lg"
          >
            Your inbox knows everything, but does nothing. Collabo reads your rough notes, spins up a team of specialized AI agents, and does the heavy lifting for you.
          </motion.p>
        </div>

        {/* Right Side: High-Octane Chat Interface */}
        <div className="relative flex flex-col space-y-8 pt-10 lg:pt-0">
          
          {/* Connecting Neural Line */}
          <div className="absolute left-[38px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-transparent hidden sm:block" />

          {CHAT_SEQUENCE.map((msg, index) => {
            const isUser = msg.role === "user";
            const isSuccess = msg.role === "success";
            const Icon = msg.icon || User;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: isUser ? 50 : -50, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.3, type: "spring", bounce: 0.4 }}
                className={`relative flex gap-6 w-full max-w-xl ${isUser ? "ml-auto" : "mr-auto"}`}
              >
                {/* Avatar with Glows */}
                {!isUser && (
                  <div className="shrink-0 relative z-10 hidden sm:block mt-4">
                    
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isSuccess ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-indigo-950 border-indigo-500 text-indigo-400"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                )}

                {/* Bubble Content */}
                <div className={`p-6 rounded-3xl text-lg leading-relaxed shadow-2xl relative overflow-hidden group ${
                  isUser 
                    ? "bg-zinc-100 text-zinc-950 rounded-tr-sm ml-auto"
                    : "bg-zinc-900/80 border border-white/5 text-zinc-300 rounded-tl-sm backdrop-blur-xl ring-1 ring-white/10"
                }`}>
                  {/* Subtle hover gradient inside system bubbles */}
                  {!isUser && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
                  
                  <span className="relative z-10">{msg.text}</span>
                </div>

                {isUser && (
                  <div className="shrink-0 relative z-10 mt-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-zinc-800 border-2 border-zinc-700 text-zinc-300">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}