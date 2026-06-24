import { Project } from "@/components/ProjectCard";

export const projects: Project[] = [
  {
    title: "OrbitXOS",
    description:
      "A real-time space safety and satellite tracking platform. Leverages machine learning models to predict collision trajectories of over 23,000 tracked objects and automate orbital trajectory corrections to prevent catastrophic collisions.",
    tags: ["React", "Three.js", "Tailwind CSS", "Framer Motion", "Recharts", "Satellite.js"],
    github: "https://github.com/Shachin-7/Orbit-xos",
    featured: true,
    isHero: true,
    year: "2026",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118555/Orbit_xos_nyxur3.mov",
  },
  {
    title: "JV Associate LLC Website",
    description:
      "A complete frontend website built from scratch for JV Associate LLC. Implemented responsive UI components with React and modern CSS, delivering design-accurate pages.",
    tags: ["React", "CSS", "Frontend", "Web App"],
    github: "https://github.com/Shachin-7/JV_ACCOSIATE_LLC",
    featured: true,
    year: "2026",
    bgColor: "bg-[#FF0000]/10 dark:bg-[#FF0000]/20",
    video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118465/Frontend_website_artwtp.mov",
  },
  {
    title: "Lead Generation & Email Automation",
    description:
      "Automated lead generation and email outreach platform to manage customer data and track engagement. Engineered backend logic to classify responses and extract structured data from unstructured email replies.",
    tags: ["JavaScript", "Node.js", "FastAPI", "MongoDB"],
    github: "https://github.com/Shachin-7/email-automation",
    featured: true,
    year: "2026",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118304/Email_automation_nw6o9w.mov",
  },
  {
    title: "AI-Based Satellite Error Prediction",
    description:
      "Built a hybrid deep learning framework using LSTM, Transformer, and GAN architectures to predict and correct GNSS satellite clock and ephemeris errors. Reduced positional deviation by 35% using feature engineering and Gaussian Process regression.",
    tags: ["Python", "TensorFlow", "LSTM", "Transformer", "GAN"],
    github: "https://github.com/Shachin-7/Satellite_error_github",
    featured: true,
    year: "2026",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    video: "https://gfwxalrohgexcl4j.public.blob.vercel-storage.com/NavICNotAiGenerated.MP4",
  },
  {
    title: "Undersea Cable Failure Detection",
    description:
      "Machine learning-based failure detection system for undersea communication cables. Predicts potential failure points using sensor data analysis and anomaly detection algorithms.",
    tags: ["Python", "Scikit-learn", "Data Analysis", "ML"],
    github:
      "https://github.com/Shachin-7/Undersea-cable-failure-detection",
    featured: true,
    year: "2026",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118335/undersea_video_d6gnor.mp4",
  },
  {
    title: "Social Media Automation",
    description:
      "An AI-driven content generation and multi-platform posting system. Integrates OpenAI, Anthropic, and HuggingFace APIs to automatically create captions and generate visual assets, with MongoDB analytics tracking engagement across networks.",
    tags: ["React", "Node.js", "Express", "MongoDB", "AI APIs"],
    github: "https://github.com/Shachin-7/Social-Media-Automation",
    featured: true,
    year: "2026",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118518/social_media_automation_z5sv0t.mov",
  },
  {
    title: "Railway Track Crack Detection",
    description:
      "Built image preprocessing and augmentation pipelines with OpenCV to detect railway track cracks with robustness against lighting variations and motion blur. Implemented automated defect logging with industrial cameras and email/SMS alerting.",
    tags: ["Python", "OpenCV", "Deep Learning", "Computer Vision"],
    github:
      "https://github.com/Shachin-7/Indian-railway-track-crack-detection-system",
    featured: true,
    year: "2026",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118557/railway_crack_detection_dsjjgv.mov",
  },
  {
    title: "OD Management System",
    description:
      "On-Duty management system for academic institutions to track and manage student attendance, OD requests, and approvals with role-based access control.",
    tags: ["Java", "MySQL", "Web App"],
    github: "https://github.com/Shachin-7/OD-management-system",
    featured: true,
    year: "2023",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781116179/OD_MANAGEMENT_dmin_yykg4a.mp4",
  },

];

export const skills = {
  languages: ["Python", "Java", "JavaScript"],
  mlAi: ["TensorFlow", "Keras", "Scikit-learn", "AI/ML"],
  data: ["Pandas", "NumPy", "Matplotlib"],
  deployment: ["FastAPI", "Streamlit"],
  databases: ["MySQL", "MongoDB", "Firebase"],
};

export const achievements = [
  {
    emoji: "🥇",
    title: "1st Place — Hackathon at BIT",
    description: "Bannari Amman Institute of Technology",
    prize: "₹50,000",
  },
  {
    emoji: "🥈",
    title: "2nd Place — Hackathon at Rathinam College",
    description: "Rathinam College of Arts and Science",
    prize: "₹7,500",
  },
  {
    emoji: "🥈",
    title: "2nd Place — Hackathon at Kumarasamy College",
    description: "Kumarasamy College of Engineering",
    prize: "₹5,000",
  },
  {
    emoji: "🥈",
    title: "2nd Place — Hackathon at Velammal College",
    description: "Velammal College of Engineering and Technology",
    prize: "₹3,000",
  },
  {
    emoji: "🥉",
    title: "3rd Place — Hackathon at KPR College",
    description: "KPR College of Arts Science & Research",
    prize: "₹15,000",
  },
  {
    emoji: "🥈",
    title: "2nd Place — DSA Coding Competition",
    description: "Data Structures & Algorithms",
    prize: "₹500",
  },
];

export const experiences = [
  {
    id: "email-automation",
    role: "Software Developer Intern",
    company: "Email Automation Startup",
    period: "2026 — Present",
    stipend: "₹12k/month",
    initials: "EA",
    color: "#22c55e",
    highlights: [
      "Built a lead generation and email automation system with response classification and data extraction",
      "Automated processing of replies to identify auto-responses and capture contact details",
      "Reduced manual outreach time by 70% through end-to-end pipeline automation",
    ],
  },
  {
    id: "jv-associate",
    role: "Frontend Developer Intern",
    company: "JV Associate LLC",
    period: "2026",
    stipend: "Internship",
    initials: "JV",
    color: "#3b82f6",
    highlights: [
      "Built a complete frontend website for JV Associate LLC from scratch",
      "Implemented responsive UI components with React and modern CSS",
      "Collaborated directly with stakeholders to deliver design-accurate pages",
    ],
  },
  {
    id: "social-media",
    role: "Social Media Automation Intern",
    company: "A Grade Ahead",
    period: "2026",
    stipend: "Internship",
    initials: "AG",
    color: "#f59e0b",
    highlights: [
      "Developed social media automation pipelines for A Grade Ahead company",
      "Automated scheduling, posting, and analytics tracking across platforms",
      "Improved content delivery efficiency and reduced manual posting overhead",
    ],
  },
];

export const experience = {
  role: "Software Developer Intern",
  stipend: "12k/month",
  highlights: [
    "Built a lead generation and email automation system with response classification and data extraction",
    "Automated processing of replies to identify auto-responses and capture contact details",
  ],
};

export const education = {
  degree: "Bachelor of Engineering in Computer Science Engineering",
  institution: "PSNA College of Engineering and Technology",
  location: "Dindigul",
  period: "2023 — 2027",
  cgpa: "8.1/10 (Upto 5th Semester)",
};

export const socialLinks = {
  github: "https://github.com/Shachin-7",
  linkedin: "https://www.linkedin.com/in/shachin-vp-859b26298",
  email: "shachinvp0506@gmail.com",
  resume: "https://drive.google.com/file/d/1zrPJEXEJ5pHyukCFcqam7tTiSkABgHNo/view?usp=sharing",
};
