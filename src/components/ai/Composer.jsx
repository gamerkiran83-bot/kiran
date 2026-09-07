import { useRef, useState } from "react";
import { PaperPlaneRight, Microphone, Stop } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const Composer = ({ onSend, busy, chips = [], placeholder }) => {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);
  const hasMic = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const send = (t) => {
    const msg = (t ?? text).trim();
    if (!msg || busy) return;
    onSend(msg);
    setText("");
  };

  const listen = () => {
    if (!hasMic) { toast.error("Voice input isn't supported in this browser"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = "en-IN"; r.interimResults = false; r.continuous = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = (e) => { setListening(false); if (e.error !== "aborted") toast.error(`Mic error: ${e.error}`); };
    r.onresult = (e) => { const spoken = Array.from(e.results).map((x) => x[0].transcript).join(" ").trim(); if (spoken) { setText(spoken); send(spoken); } };
    recogRef.current = r;
    try { r.start(); } catch { setListening(false); }
  };
  const stop = () => { try { recogRef.current?.stop(); } catch {} setListening(false); };

  return (
    <div className="space-y-2">
      {chips.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5" data-testid="ai-quick-prompts">
          {chips.map((c) => <button key={c} onClick={() => send(c)} disabled={busy} data-testid="ai-quick-prompt" className="shrink-0 px-3 py-1.5 rounded-full text-xs bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/40 transition-colors">{c}</button>)}
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="glass-strong rounded-[26px] p-2 flex items-end gap-2">
        <textarea data-testid="ai-input" value={text} onChange={(e) => setText(e.target.value)} rows={1} disabled={busy} aria-label="Ask TripPilot"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={placeholder || "Ask TripPilot anything — plan, replan, weather, food, hotels, budget, translate…"}
          className="flex-1 bg-transparent resize-none outline-none text-sm px-3 py-2.5 max-h-40 placeholder:text-muted-foreground" style={{ minHeight: 40 }} />
        <Button type="button" size="icon" onClick={listening ? stop : listen} data-testid="ai-mic-btn" aria-label={listening ? "Stop listening" : "Speak"}
          className={`rounded-full h-10 w-10 ${listening ? "bg-red-500 text-white animate-pulse" : "bg-secondary/80 hover:bg-secondary text-secondary-foreground"}`}>
          {listening ? <Stop size={16} weight="fill" /> : <Microphone size={16} weight="fill" />}
        </Button>
        <Button type="submit" size="icon" disabled={busy || !text.trim()} data-testid="ai-send-btn" aria-label="Send" className="rounded-full h-10 w-10 btn-3d bg-primary text-primary-foreground"><PaperPlaneRight size={16} weight="fill" /></Button>
      </form>
    </div>
  );
};

export default Composer;
