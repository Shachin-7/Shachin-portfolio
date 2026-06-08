import { Project } from "@/components/ProjectCard";

export const projects: Project[] = [

  {
    title: "AI-Based Satellite Error Prediction",
    description:
      "Built a hybrid deep learning framework using LSTM, Transformer, and GAN architectures to predict and correct GNSS satellite clock and ephemeris errors. Reduced positional deviation by 35% using feature engineering and Gaussian Process regression.",
    tags: ["Python", "TensorFlow", "LSTM", "Transformer", "GAN"],
    github: "https://github.com/Shachin-7/Satellite_error_github",
    featured: true,
    year: "2024",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    title: "Railway Track Crack Detection",
    description:
      "Built image preprocessing and augmentation pipelines with OpenCV to detect railway track cracks with robustness against lighting variations and motion blur. Implemented automated defect logging with industrial cameras and email/SMS alerting.",
    tags: ["Python", "OpenCV", "Deep Learning", "Computer Vision"],
    github:
      "https://github.com/Shachin-7/Indian-railway-track-crack-detection-system",
    featured: true,
    year: "2024",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Undersea Cable Failure Detection",
    description:
      "Machine learning-based failure detection system for undersea communication cables. Predicts potential failure points using sensor data analysis and anomaly detection algorithms.",
    tags: ["Python", "Scikit-learn", "Data Analysis", "ML"],
    github:
      "https://github.com/Shachin-7/Undersea-cable-failure-detection",
    featured: true,
    year: "2024",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    title: "Lead Generation & Email Automation",
    description:
      "Automated lead generation and email outreach platform to manage customer data and track engagement. Engineered backend logic to classify responses and extract structured data from unstructured email replies.",
    tags: ["JavaScript", "Node.js", "FastAPI", "MongoDB"],
    github: "https://github.com/vengatavisva/email-automation",
    featured: true,
    year: "2024",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    title: "JV Associate LLC Website",
    description:
      "A complete frontend website built from scratch for JV Associate LLC. Implemented responsive UI components with React and modern CSS, delivering design-accurate pages.",
    tags: ["React", "CSS", "Frontend", "Web App"],
    github: "https://github.com/vengatavisva/JV_ACCOSIATE_LLC",
    year: "2024",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    title: "OD Management System",
    description:
      "On-Duty management system for academic institutions to track and manage student attendance, OD requests, and approvals with role-based access control.",
    tags: ["Java", "MySQL", "Web App"],
    github: "https://github.com/Shachin-7/OD-management-system",
    year: "2023",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
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
    period: "2024 — Present",
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
    period: "2024",
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
    period: "2024",
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
  linkedin: "https://linkedin.com/in/shachinvp",
  email: "shachinvp0506@gmail.com",
};
