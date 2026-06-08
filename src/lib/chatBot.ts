import { projects, skills, achievements, experiences, education, socialLinks } from "@/data/portfolio";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/* ─── Knowledge base built from portfolio data ─── */
const projectList = projects
  .map(
    (p) =>
      `• **${p.title}** (${p.year}) — ${p.description} [Tags: ${p.tags.join(", ")}]`
  )
  .join("\n");

const featuredProjects = projects
  .filter((p) => p.featured)
  .map((p) => `• **${p.title}** — ${p.description}`)
  .join("\n");

const skillsSummary = `
**Languages:** ${skills.languages.join(", ")}
**ML & AI:** ${skills.mlAi.join(", ")}
**Data Tools:** ${skills.data.join(", ")}
**Deployment:** ${skills.deployment.join(", ")}
**Databases:** ${skills.databases.join(", ")}
`.trim();

const achievementList = achievements
  .map((a) => `${a.emoji} ${a.title} — ${a.description} (Prize: ${a.prize})`)
  .join("\n");

const experienceList = experiences
  .map(
    (e) =>
      `• **${e.role}** at ${e.company} (${e.period})${e.stipend ? ` — ${e.stipend}` : ""}\n  ${e.highlights.join("\n  ")}`
  )
  .join("\n\n");

const educationInfo = `**${education.degree}**\n${education.institution}, ${education.location}\n${education.period} — CGPA: ${education.cgpa}`;

const contactInfo = `📧 Email: ${socialLinks.email}\n🔗 LinkedIn: ${socialLinks.linkedin}\n💻 GitHub: ${socialLinks.github}`;

/* ─── Response patterns ─── */
interface PatternResponse {
  patterns: RegExp[];
  response: string;
}

const responses: PatternResponse[] = [
  /* ─ About / Who ─ */
  {
    patterns: [
      /who\s+(are|is)\s+(you|shachin|sha)/i,
      /about\s+(you|shachin|sha|me|yourself)/i,
      /tell\s+me\s+about/i,
      /introduce/i,
      /what\s+do\s+you\s+do/i,
    ],
    response: `Hi! I'm **Shachin VP**, an aspiring **AI Research & Development Engineer** currently pursuing a B.E. in Computer Science Engineering at PSNA College of Engineering and Technology, Dindigul (2023–2027).\n\nI specialize in building **deep learning architectures**, **end-to-end ML pipelines**, **real-time prediction systems**, and **API-based deployments**. I'm passionate about solving real-world problems using machine learning and have won multiple hackathons across Tamil Nadu! 🏆`,
  },

  /* ─ Skills ─ */
  {
    patterns: [
      /skill/i,
      /tech\s*stack/i,
      /technologies/i,
      /what\s+.*\s+(know|use|work\s+with)/i,
      /expertise/i,
      /proficien/i,
    ],
    response: `Here's my tech arsenal 🛠️\n\n${skillsSummary}\n\nI primarily work with **Python** for ML/AI projects and **JavaScript** for web development. My strongest domain is **Machine Learning & Deep Learning**.`,
  },

  /* ─ Frontend ─ */
  {
    patterns: [
      /frontend/i,
      /front[\s-]?end/i,
      /react/i,
      /web\s*dev/i,
      /css/i,
      /html/i,
      /ui/i,
    ],
    response: `In frontend development, I work with **React**, **Next.js**, **JavaScript/TypeScript**, and **modern CSS**.\n\nHere are some frontend projects I've built:\n\n• **JV Associate LLC Website** — A complete responsive frontend built from scratch using React and modern CSS\n• **This Portfolio** — Built with Next.js, Framer Motion, GSAP, and Three.js with stunning animations\n\nWhile my primary focus is ML/AI, I enjoy building polished, interactive web interfaces! ✨`,
  },

  /* ─ Machine Learning / AI / Deep Learning ─ */
  {
    patterns: [
      /machine\s*learning/i,
      /\bml\b/i,
      /deep\s*learning/i,
      /\bai\b/i,
      /artificial\s*intelligence/i,
      /neural\s*net/i,
      /model/i,
      /tensorflow/i,
      /keras/i,
    ],
    response: `Machine Learning & AI is my core specialization! 🧠\n\nI work extensively with **TensorFlow**, **Keras**, **Scikit-learn**, and deep learning architectures including **LSTM**, **Transformers**, and **GANs**.\n\nSome of my ML projects:\n\n• **AI-Based Satellite Error Prediction** — Hybrid LSTM + Transformer + GAN framework, reduced positional deviation by 35%\n• **Railway Track Crack Detection** — Computer vision pipeline using OpenCV and deep learning\n• **Undersea Cable Failure Detection** — Anomaly detection with sensor data analysis\n\nI'm passionate about applying ML to solve real-world infrastructure and safety problems!`,
  },

  /* ─ Projects ─ */
  {
    patterns: [
      /project/i,
      /portfolio/i,
      /what\s+(have|did)\s+(you|shachin)\s+(build|make|create|work)/i,
      /show\s+(me\s+)?(your\s+)?work/i,
    ],
    response: `Here are my projects 🚀\n\n${projectList}\n\nYou can check out all my projects on the **Projects** page or visit my GitHub at ${socialLinks.github}!`,
  },

  /* ─ Experience / Work ─ */
  {
    patterns: [
      /experience/i,
      /work\s*history/i,
      /intern/i,
      /job/i,
      /career/i,
      /where\s+(have|did)\s+(you|shachin)\s+work/i,
      /employment/i,
    ],
    response: `Here's my professional experience 💼\n\n${experienceList}\n\nI'm always looking for exciting opportunities in AI/ML and software development!`,
  },

  /* ─ Achievements / Hackathons ─ */
  {
    patterns: [
      /achiev/i,
      /award/i,
      /hackathon/i,
      /competition/i,
      /prize/i,
      /win/i,
      /won/i,
    ],
    response: `I've participated in and won several hackathons across Tamil Nadu! 🏆\n\n${achievementList}\n\nCompetitive programming and hackathons have been a huge part of my growth as a developer!`,
  },

  /* ─ Education ─ */
  {
    patterns: [
      /educat/i,
      /college/i,
      /university/i,
      /degree/i,
      /study/i,
      /school/i,
      /cgpa/i,
      /gpa/i,
      /psna/i,
    ],
    response: `Here's my educational background 🎓\n\n${educationInfo}\n\nI'm actively pursuing my degree while working on real-world ML projects and internships!`,
  },

  /* ─ Contact ─ */
  {
    patterns: [
      /contact/i,
      /reach/i,
      /email/i,
      /linkedin/i,
      /github/i,
      /social/i,
      /connect/i,
      /hire/i,
      /collaborate/i,
    ],
    response: `You can reach me through:\n\n${contactInfo}\n\nFeel free to connect — I'm always open to collaborations, internships, and interesting projects! 🤝`,
  },

  /* ─ Python ─ */
  {
    patterns: [/python/i],
    response: `Python is my **primary programming language** and I use it extensively for:\n\n• **Machine Learning** — TensorFlow, Keras, Scikit-learn\n• **Data Analysis** — Pandas, NumPy, Matplotlib\n• **API Development** — FastAPI\n• **Computer Vision** — OpenCV\n\nMost of my flagship projects (Satellite Error Prediction, Railway Crack Detection, Undersea Cable Detection) are built with Python! 🐍`,
  },

  /* ─ Java ─ */
  {
    patterns: [/java(?!script)/i],
    response: `I use **Java** for backend and enterprise-level applications.\n\nMy notable Java project:\n• **OD Management System** — An on-duty management system for academic institutions with role-based access control, built with Java and MySQL.\n\nJava is one of my core languages alongside Python and JavaScript!`,
  },

  /* ─ Data ─ */
  {
    patterns: [/data/i, /pandas/i, /numpy/i, /analy/i],
    response: `For data analysis & manipulation, I work with:\n\n• **Pandas** — Data manipulation and analysis\n• **NumPy** — Numerical computing\n• **Matplotlib** — Data visualization\n• **Scikit-learn** — ML model training & evaluation\n\nI've applied these in projects like **Satellite Error Prediction** (feature engineering, Gaussian Process regression) and **Undersea Cable Failure Detection** (sensor data analysis and anomaly detection).`,
  },

  /* ─ Database ─ */
  {
    patterns: [/database/i, /mysql/i, /mongodb/i, /firebase/i, /\bdb\b/i, /sql/i],
    response: `I work with both relational and NoSQL databases:\n\n• **MySQL** — Used in OD Management System\n• **MongoDB** — Used in Lead Generation & Email Automation\n• **Firebase** — Real-time database capabilities\n\nI'm comfortable designing schemas, writing queries, and building backend APIs that connect to these databases.`,
  },

  /* ─ Greetings ─ */
  {
    patterns: [/^(hi|hello|hey|yo|sup|good\s*(morning|afternoon|evening))/i],
    response: `Hello there! 👋 I'm Shachin's portfolio assistant. I can tell you about:\n\n• **About Me** — Who is Shachin?\n• **Skills & Tech Stack** — What technologies I use\n• **Projects** — My featured work\n• **Experience** — My internships & work\n• **Achievements** — Hackathon wins 🏆\n• **Education** — Academic background\n• **Contact** — How to reach me\n\nWhat would you like to know?`,
  },

  /* ─ Thanks ─ */
  {
    patterns: [/thank/i, /thanks/i, /thx/i],
    response: `You're welcome! 😊 Feel free to ask me anything else about Shachin's skills, projects, or experience. I'm here to help!`,
  },

  /* ─ Bye ─ */
  {
    patterns: [/bye/i, /goodbye/i, /see\s*ya/i, /later/i],
    response: `Goodbye! 👋 Thanks for visiting Shachin's portfolio. Feel free to come back anytime, and don't forget to check out the **Contact** page if you'd like to connect!`,
  },

  /* ─ Help ─ */
  {
    patterns: [/help/i, /what\s+can\s+you/i, /how\s+do/i, /guide/i],
    response: `I can help you learn about Shachin VP! Try asking me:\n\n• "Who are you?"\n• "What are your skills?"\n• "Tell me about your projects"\n• "What is your experience?"\n• "What are your achievements?"\n• "What is your education?"\n• "How can I contact you?"\n• "Tell me about your ML projects"\n• "What frontend technologies do you use?"\n\nJust type your question and I'll do my best to answer! 💬`,
  },
];

/* ─── Main chat function ─── */
export function getResponse(userMessage: string): string {
  const msg = userMessage.trim();
  if (!msg) return "Please type a message — I'm happy to help! 😊";

  for (const { patterns, response } of responses) {
    for (const pattern of patterns) {
      if (pattern.test(msg)) {
        return response;
      }
    }
  }

  return `I'm not sure I understand that question, but I'd love to help! 🤔\n\nTry asking me about:\n• **Skills** — "What are your skills?"\n• **Projects** — "Show me your projects"\n• **Experience** — "Where have you worked?"\n• **Achievements** — "What awards have you won?"\n• **Education** — "Where do you study?"\n• **Contact** — "How can I reach you?"\n\nOr just say **"Hi"** to get started!`;
}

/* ─── Quick actions ─── */
export const quickActions = [
  { label: "About Me", subtitle: "Who are you?", query: "Who are you?" },
  { label: "Skills & Expertise", subtitle: "View your core skills", query: "What are your skills?" },
  { label: "Work Experience", subtitle: "See past experience", query: "Tell me about your experience" },
];
