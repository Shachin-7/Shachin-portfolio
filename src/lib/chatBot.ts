export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/* ─── AI-powered chat via Gemini API route ─── */
export async function getAIResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) throw new Error(`API returned ${res.status}`);

    const data = await res.json();
    return data.response ?? "Sorry, I couldn't generate a response right now.";
  } catch {
    return getFallbackResponse(messages[messages.length - 1]?.content ?? "");
  }
}

/* ─── Fallback (offline / API failure) ─── */
function getFallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();
  if (!msg) return "Please type a message — I'm happy to help! 😊";

  if (/^(hi|hello|hey|yo|sup)/.test(msg))
    return "Hello there! 👋 I'm Shachin's portfolio assistant. Ask me anything about my skills, projects, experience, or achievements!";
  if (/skill|tech|stack|expertise/.test(msg))
    return "My core skills include **Python**, **TensorFlow**, **Keras**, **Scikit-learn** for ML/AI, and **JavaScript**, **React**, **Next.js** for web development. Ask me to rate them or go into detail!";
  if (/project/.test(msg))
    return "I've built projects like **AI-Based Satellite Error Prediction**, **Railway Track Crack Detection**, **Lead Generation & Email Automation**, and more. Ask me about any specific one!";
  if (/experience|intern|work/.test(msg))
    return "I've interned as a **Software Developer** at an Email Automation Startup, a **Frontend Developer** at JV Associate LLC, and a **Social Media Automation Intern** at A Grade Ahead.";
  if (/achiev|award|hackathon|win/.test(msg))
    return "I've won multiple hackathons across Tamil Nadu! 🏆 Including 1st place at BIT (₹50,000 prize) and several 2nd and 3rd place finishes.";
  if (/educat|college|degree|cgpa/.test(msg))
    return "I'm pursuing a **B.E. in Computer Science Engineering** at PSNA College of Engineering and Technology, Dindigul (2023–2027) with a CGPA of **8.1/10**.";
  if (/contact|email|linkedin|github|hire/.test(msg))
    return "📧 Email: shachinvp0506@gmail.com\n🔗 LinkedIn: linkedin.com/in/shachin-vp-859b26298\n💻 GitHub: github.com/Shachin-7";

  return "I can tell you about Shachin's **skills**, **projects**, **experience**, **achievements**, **education**, or **contact info**. What would you like to know? 😊";
}

/* ─── Quick actions ─── */
export const quickActions = [
  { label: "About Me", subtitle: "Who are you?", query: "Who are you?" },
  { label: "Skills & Expertise", subtitle: "View your core skills", query: "What are your skills and rate them out of 10?" },
  { label: "Work Experience", subtitle: "See past experience", query: "Tell me about your work experience" },
];
