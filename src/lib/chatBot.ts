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
    return "Hello there! 👋 I am Shachin VP's AI R&D Assistant. Feel free to ask about my **Machine Learning projects**, **AI/Deep Learning skills**, **Hackathon wins**, or **work experience**!";
  if (/resume|background|profile|who/.test(msg))
    return "**Shachin VP — Resume Highlights** 📄\n\n**Career Profile**:\nDynamic AI Engineer & 5x Hackathon Champion building hybrid deep learning pipelines (achieving **85%+ accuracy** & cutting error drift by **35%**) and full-stack platforms for US corporate clients.\n\n**Core Skills**:\n- **Languages & Frameworks**: Python, Java, JavaScript, HTML5, CSS3\n- **AI/ML & Vision**: Hybrid Deep Learning, LSTM, Transformers, GANs, TensorFlow, OpenCV\n- **Web & Backend**: React.js, Next.js, Three.js, FastAPI, Express.js, MongoDB, MySQL\n\n**Experience & Internships**:\n- **Software Developer Intern**: Deployed full multi-page site for a US industrial sourcing firm; built NLP lead outreach pipeline (slashing manual effort by **70%**).\n- **Freelance Developer**: Designed & built executive portfolio for **Director of ABB Company** (₹18k project) & **Senior Business Analyst** (₹10k project).\n\n**Achievements**:\n- 🏆 **5x Hackathon Podium Finisher**: 1st Place at BIT (₹50,000), 2nd Place at Rathinam, Kumarasamy & Velammal, 3rd Place at KPR.\n\n**Education**:\n- **B.E. Computer Science Engineering** @ PSNA College (2023–2027) | **CGPA: 8.1/10**";
  if (/skill|tech|stack|expertise/.test(msg))
    return "**Core Engineering Competencies**:\n\n- **Deep Learning & AI (9/10)**: TensorFlow, Keras, LSTM, Transformers, GANs\n- **Machine Learning (9/10)**: Scikit-learn, Feature Engineering, Gaussian Process Regression\n- **Python & Data Tools (9/10)**: NumPy, Pandas, Async Pipelines\n- **Computer Vision (8/10)**: OpenCV, Defect Detection under Blur\n- **Full-Stack Deployments (7/10)**: FastAPI, React, Next.js, Three.js";
  if (/orbit|satellite|space|error|project/.test(msg))
    return "Here are Shachin's top **AI & ML Projects**:\n\n1. **OrbitXOS**: Real-time space safety platform tracking 23,000+ objects with collision trajectory prediction.\n2. **AI GNSS Satellite Error Prediction**: Hybrid LSTM + Transformer + GAN framework reducing ephemeris/clock error by **35%**.\n3. **Railway Defect Detection**: OpenCV image preprocessing pipeline for automated crack detection & alerting.";
  if (/experience|intern|work/.test(msg))
    return "**Work & Internship Experience**:\n\n- **Software Developer Intern** (Email Automation Startup): Built NLP lead classification pipelines, reducing manual outreach by **70%**.\n- **Frontend Developer Intern** (JV Associate LLC): Built full production site with React & modern CSS.\n- **Social Media Automation Intern** (A Grade Ahead): Built automated scheduling & analytics pipelines.";
  if (/achiev|award|hackathon|win/.test(msg))
    return "**Hackathon Honors & Awards** 🏆:\n\n- 🥇 **1st Place**: BIT Hackathon (₹50,000 Cash Prize)\n- 🥈 **2nd Place**: Rathinam College (₹7,500)\n- 🥈 **2nd Place**: Kumarasamy College (₹5,000)\n- 🥈 **2nd Place**: Velammal College (₹3,000)\n- 🥉 **3rd Place**: KPR College (₹15,000)";
  if (/educat|college|degree|cgpa/.test(msg))
    return "**Academic Background**:\n\n- **B.E. Computer Science Engineering** at PSNA College of Engineering and Technology (2023 – 2027)\n- **CGPA**: **8.1/10** (Upto 5th Semester)";
  if (/contact|email|linkedin|github|hire/.test(msg))
    return "**Connect with Shachin** 📬:\n\n- 📧 **Email**: shachinvp0506@gmail.com\n- 🔗 **LinkedIn**: [linkedin.com/in/shachin-vp](https://www.linkedin.com/in/shachin-vp-859b26298)\n- 💻 **GitHub**: [github.com/Shachin-7](https://github.com/Shachin-7)";

  return "I can answer questions about Shachin's **projects (OrbitXOS, Satellite AI)**, **Deep Learning skills**, **Hackathon wins**, **work experience**, or **contact details**!";
}

/* ─── Quick actions ─── */
export const quickActions = [
  { label: "👤 About Shachin", subtitle: "Resume & Background", query: "Tell me about Shachin's background, education, and resume highlights" },
  { label: "🤖 Deep Learning & AI", subtitle: "Core technical expertise", query: "What is Shachin's expertise in Deep Learning and AI architectures?" },
  { label: "🏆 Hackathon Wins", subtitle: "1st Place & Awards", query: "List Shachin's hackathon achievements and prizes won" },
];
