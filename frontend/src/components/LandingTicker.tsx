"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const AGENTS = [
  "NLP Analyzer", "Thread Architect", "SEO Optimizer", "Tone Specialist", 
  "Markdown Formatter", "Context Synthesizer", "Hook Crafter", "Data Extractor"
];

export default function LandingTicker() {
  return (
    <section className="relative w-full py-8 bg-zinc-950 border-y border-white/5 overflow-hidden flex items-center z-20">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

      <div className="flex w-[200%] animate-marquee">
        {/* We map the array twice to create a seamless infinite loop */}
        {[...AGENTS, ...AGENTS].map((agent, i) => (
          <div key={i} className="flex items-center gap-4 px-8 whitespace-nowrap">
            <Sparkles className="w-4 h-4 text-indigo-500/50" />
            <span className="text-sm font-medium tracking-widest uppercase text-zinc-500">
              {agent}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}