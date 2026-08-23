"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getAIResponse, quickActions, type ChatMessage } from "@/lib/chatBot";
import FaultyTerminal from "./FaultyTerminal";
import MeetEdithButton from "./MeetEdithButton";
import "./ChatAssistant.css";

/* ─── Rich formatting renderer (Bold, Links, Bullet lists) ─── */
function renderFormattedText(text: string) {
  const boldRegex = /(\*\*[^*]+\*\*)/g;

  return text.split("\n").map((line, lineIdx) => {
    const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
    const cleanLine = isBullet ? line.trim().substring(2) : line;

    const parts = cleanLine.split(boldRegex);

    const renderedParts = parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }

      // Render links [text](url)
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const pre = part.substring(0, linkMatch.index);
        const post = part.substring((linkMatch.index || 0) + linkMatch[0].length);
        return (
          <span key={i}>
            {pre}
            <a
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-highlight underline font-medium hover:opacity-80 transition-opacity"
            >
              {linkMatch[1]}
            </a>
            {post}
          </span>
        );
      }

      return <span key={i}>{part}</span>;
    });

    if (isBullet) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
          <span className="text-highlight mt-1 text-xs">•</span>
          <span>{renderedParts}</span>
        </div>
      );
    }

    return (
      <div key={lineIdx} className={line.trim() === "" ? "h-2" : "my-0.5"}>
        {renderedParts}
      </div>
    );
  });
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className={`chat-msg chat-msg-${msg.role}`}>
      {renderFormattedText(msg.content)}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="chat-typing">
      <div className="chat-typing-dot" />
      <div className="chat-typing-dot" />
      <div className="chat-typing-dot" />
    </div>
  );
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = { role: "user", content: text.trim() };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsTyping(true);

      const response = await getAIResponse(updatedMessages);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    },
    [messages]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const showWelcome = messages.length === 0;

  return (
    <>
      {/* ─── FAB Button ─── */}
      <AnimatePresence>
        {!isOpen && <MeetEdithButton onClick={() => setIsOpen(true)} text="Meet Edith" />}
      </AnimatePresence>

      {/* ─── Chat Panel ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* FaultyTerminal WebGL Shader Background (Assistant Only) */}
            <div className="chat-pillar-bg">
              <FaultyTerminal
                scale={1.5}
                gridMul={[2, 1]}
                digitSize={1.2}
                timeScale={0.5}
                pause={false}
                scanlineIntensity={0.5}
                glitchAmount={1}
                flickerAmount={1}
                noiseAmp={1}
                chromaticAberration={0}
                dither={0}
                curvature={0.1}
                tint="#A7EF9E"
                mouseReact
                mouseStrength={0.5}
                pageLoadAnimation
                brightness={0.6}
              />
            </div>

            <div className="chat-panel-content">
              {/* Header */}
              <div className="chat-header">
                <div className="chat-header-left">
                  <span className="chat-header-sparkle">✨</span>
                  <span>EDITH</span>
                  <span className="chat-header-subtitle">built by Shachin</span>
                </div>
                <div className="chat-header-actions">
                  <button
                    className="chat-header-btn"
                    onClick={clearChat}
                    aria-label="Clear chat"
                    title="Clear chat"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                  <button
                    className="chat-header-btn"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                    title="Close"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {showWelcome ? (
                  <div className="chat-welcome">
                    <h3>Hello, I&apos;m EDITH 👋</h3>
                    <p>Shachin&apos;s AI Assistant. How can I help you today?</p>

                    <div className="chat-quick-actions">
                      {quickActions.map((action) => (
                        <button
                          key={action.label}
                          className="chat-quick-btn"
                          onClick={() => sendMessage(action.query)}
                        >
                          <strong>{action.label}</strong>
                          <span>{action.subtitle}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <MessageBubble key={index} msg={msg} />
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <form className="chat-input-area" onSubmit={handleSubmit}>
                <div className="chat-input-wrapper">
                  <input
                    ref={inputRef}
                    className="chat-input"
                    type="text"
                    placeholder="Send a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    className="chat-send-btn"
                    disabled={!input.trim() || isTyping}
                    aria-label="Send message"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
