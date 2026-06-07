"use client";

import { Sparkle } from "lucide-react";

const marqueeItems = [
  "Machine Learning",
  "Deep Learning",
  "Computer Vision",
  "NLP",
  "Data Science",
  "Neural Networks",
  "AI Engineering",
  "TensorFlow",
  "Python",
  "FastAPI",
];

export default function ScrollMarquee() {
  return (
    <div className="marquee-container">
      <div className="marquee-fade-left" />
      <div className="marquee-fade-right" />
      <div className="marquee-track">
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <div key={i} className="marquee-item">
            <span>{item}</span>
            <Sparkle size={20} className="text-bg-600" />
          </div>
        ))}
      </div>
    </div>
  );
}
