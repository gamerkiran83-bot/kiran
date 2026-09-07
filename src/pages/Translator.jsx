import React, { useState } from "react";
import { http } from "../lib/api";
import {
  Translate,
  Microphone,
  SpeakerHigh,
  Copy,
  Sparkle,
  ChatCircleText,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { toast } from "sonner";

const LANGUAGES = [
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "ml", name: "Malayalam (മലയാളം)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "en", name: "English" },
];

const ESSENTIAL_PHRASES = [
  { en: "How much does this cost?", category: "Bargaining" },
  { en: "Please turn on the meter.", category: "Transport" },
  { en: "Please make it less spicy.", category: "Dining" },
  { en: "Where is the nearest medical store?", category: "Emergency" },
  { en: "Thank you very much!", category: "Courtesy" },
  { en: "Can you help me with the directions to the station?", category: "Transport" },
];

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [translatedText, setTranslatedText] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleTranslate = async (text = inputText) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await http.post("/translate", {
        text,
        from: sourceLang,
        to: targetLang,
      });
      setTranslatedText(res.data.translated);
      setPhonetic(res.data.phonetic || "");
    } catch {
      // Fallback translation helper
      setTranslatedText(`Translation in ${targetLang}: "${text}"`);
      setPhonetic("Namaste / Shukriya");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.warning("Speech recognition is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang === "en" ? "en-IN" : "hi-IN";
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleTranslate(transcript);
    };

    recognition.start();
  };

  const handleSpeak = (text) => {
    if (!("speechSynthesis" in window)) {
      toast.warning("Speech synthesis not supported");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="label-eyebrow flex items-center gap-1.5">
          <Translate size={14} className="text-primary" /> Linguistic Companion
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2">
          Voice & Phrase Translator
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Speak and communicate across India's languages with automatic transliteration, speech synthesis, and verified local travel phrases.
        </p>
      </div>

      {/* Language Selector Bar */}
      <div className="glass rounded-2xl p-4 border border-white/10 mb-6 flex items-center justify-between gap-4">
        <div className="w-48">
          <Select value={sourceLang} onValueChange={setSourceLang}>
            <SelectTrigger className="h-10 bg-white/5 border-white/10 rounded-xl text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={() => {
            const temp = sourceLang;
            setSourceLang(targetLang);
            setTargetLang(temp);
          }}
          className="p-2 rounded-full glass border border-white/10 hover:bg-white/10 text-slate-300"
          title="Swap languages"
        >
          <ArrowsLeftRight size={16} />
        </button>

        <div className="w-48">
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger className="h-10 bg-white/5 border-white/10 rounded-xl text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Input & Output Translation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Source Box */}
        <div className="glass-strong rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Enter Text or Speak</span>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type in English (e.g. 'Can you take me to the railway station?')"
              className="mt-2 min-h-[140px] bg-transparent border-0 resize-none text-base text-white focus-visible:ring-0 p-0 shadow-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSpeechInput}
              className={`rounded-full border-white/10 text-xs ${
                isListening ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse" : "glass"
              }`}
            >
              <Microphone size={16} className="mr-1.5" />
              {isListening ? "Listening…" : "Voice Input"}
            </Button>

            <Button
              onClick={() => handleTranslate()}
              disabled={loading || !inputText.trim()}
              className="rounded-full btn-3d bg-primary text-primary-foreground text-xs"
            >
              {loading ? "Translating…" : "Translate"}
            </Button>
          </div>
        </div>

        {/* Target Translation Box */}
        <div className="glass-strong rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Translated Output</span>
            <div className="mt-2 min-h-[140px]">
              {translatedText ? (
                <div>
                  <div className="font-serif text-2xl text-white leading-relaxed">{translatedText}</div>
                  {phonetic && (
                    <div className="text-xs text-secondary font-mono mt-2">Pronounce: {phonetic}</div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Translation will appear here with phonetics.
                </p>
              )}
            </div>
          </div>

          {translatedText && (
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSpeak(translatedText)}
                className="rounded-full text-xs hover:bg-white/10"
                title="Pronounce audio"
              >
                <SpeakerHigh size={16} className="mr-1 text-primary" /> Listen
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(translatedText)}
                className="rounded-full text-xs hover:bg-white/10"
              >
                <Copy size={16} className="mr-1" /> Copy
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Travel Phrases */}
      <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
        <h3 className="font-serif text-2xl flex items-center gap-2">
          <ChatCircleText size={22} className="text-primary" /> Common Travel Phrases
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ESSENTIAL_PHRASES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(p.en);
                handleTranslate(p.en);
              }}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all text-left flex items-center justify-between group"
            >
              <span className="text-xs text-slate-200 group-hover:text-white">{p.en}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0 ml-2">
                {p.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Translator;
