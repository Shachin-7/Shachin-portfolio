"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";

const transition1 = { bounce: 0.2, delay: 0, duration: 0.4, type: "spring" as const };
const transformTemplate1 = (_: any, t: string) => `translateX(-50%) ${t}`;

const animation = { opacity: 1, rotate: 59, rotateX: 0, rotateY: 0, scale: 1.3, skewX: 0, skewY: 0, transition: transition1, y: 59 };
const animation1 = { opacity: 1, rotate: -9, rotateX: 0, rotateY: 0, scale: 1.3, skewX: 0, skewY: 0, transition: transition1, x: -12, y: 28 };
const animation2 = { opacity: 1, rotate: 18, rotateX: 0, rotateY: 0, scale: 1.3, skewX: 0, skewY: 0, transition: transition1, x: -12, y: 28 };
const animation3 = { opacity: 1, rotate: -26, rotateX: 0, rotateY: 0, scale: 1.3, skewX: 0, skewY: 0, transition: transition1, x: -12, y: 28 };
const animation4 = { opacity: 1, rotate: -41, rotateX: 0, rotateY: 0, scale: 1.3, skewX: 0, skewY: 0, transition: transition1, x: -12, y: 51 };

const images = {
  image1: "/images/IMG_9964.jpg",
  image2: "/images/IMG_8761.jpg",
  image3: "/images/IMG_9961.jpg",
  image4: "/images/IMG_3975.jpg",
  image5: "/images/IMG_3978.jpg",
  clip: "https://framerusercontent.com/images/U9eXOl3LNm2e6HGQ8jzhLdIn8BM.png?width=736&height=736",
};

const achievementsList = [
  {
    title: "1st Place – Hackathon at BIT",
    venue: "Bannari Amman Institute of Technology",
    prize: "₹50,000",
    emoji: "🥇",
  },
  {
    title: "2nd Place – Hackathon at Rathinam College",
    venue: "Rathinam College of Arts and Science",
    prize: "₹7,500",
    emoji: "🥈",
  },
  {
    title: "2nd Place – Hackathon at Kumarasamy College",
    venue: "Kumarasamy College of Engineering",
    prize: "₹5,000",
    emoji: "🥈",
  },
  {
    title: "2nd Place – Hackathon at Velammal College",
    venue: "Velammal College of Engineering & Tech",
    prize: "₹3,000",
    emoji: "🥈",
  },
  {
    title: "3rd Place – Hackathon at KPR College",
    venue: "KPR College of Arts Science & Research",
    prize: "₹15,000",
    emoji: "🥉",
  },
  {
    title: "2nd Place – DSA Coding Competition",
    venue: "Data Structures & Algorithms Track",
    prize: "₹500",
    emoji: "⚡",
  },
];

export default function ClotheslineGallery() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const availableWidth = wrapperRef.current.clientWidth || window.innerWidth;
        const newScale = Math.min(1, availableWidth / 1288);
        setScale(newScale);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="w-full my-12 bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 md:p-12 relative">
      {/* ── Header Section (Matching typography and layout) ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4 md:mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold tracking-wider text-slate-600 uppercase mb-3">
            <Sparkles size={13} className="text-emerald-500" />
            Awards & Recognition
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight leading-[1.12]"
            style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
          >
            Design. Build. Ship. Repeat.
          </h2>
        </div>

        <p
          className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-lg font-light"
          style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
        >
          A space where ideas get sketched, questioned, and pushed until they actually work. Some days that&apos;s a whiteboard, some days it&apos;s a messy prototype nobody&apos;s seen yet. This back-and-forth between imagining and building is where the real work happens — and it&apos;s what keeps things interesting.
        </p>
      </div>

      {/* ── Clothesline Gallery Interactive Visual Area ── */}
      <div
        ref={wrapperRef}
        className="w-full flex justify-center items-start overflow-visible relative"
        style={{
          height: `${501 * scale + 20}px`,
        }}
      >
        <div
          className="framer-13v7yhu origin-top relative"
          style={{
            transform: `scale(${scale})`,
            width: "1288px",
            height: "501px",
            flexShrink: 0,
          }}
        >
          {/* Wire SVG */}
          <div
            className="framer-82wzl3"
            style={{ transform: "translateX(-50%)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1326 303.5"
              className="framer-lek6dv overflow-visible"
            >
              <path
                d="M 1326 0 C 1326 167.618 1029.165 303.5 663 303.5 C 296.835 303.5 0 167.618 0 0"
                fill="transparent"
                strokeWidth="2"
                stroke="#AAA"
              />
            </svg>
          </div>

          {/* Item 1 */}
          <motion.div
            className="framer-yzuj3h"
            style={{ rotate: -3 }}
          >
            <motion.div
              className="framer-5g2h11"
              style={{ backgroundColor: "rgb(255, 255, 255)", rotate: 29 }}
              whileHover={animation}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.image1}
                alt="1"
                className="framer-19pgdqx"
              />
            </motion.div>
            {/* Clip 1 */}
            <motion.img
              src={images.clip}
              alt="clip1"
              className="framer-1q3jk6e pointer-events-none"
              style={{ rotate: 29 }}
            />
          </motion.div>

          {/* Item 2 */}
          <motion.div className="framer-3i1yhu">
            <motion.div
              className="framer-7h50c"
              style={{ backgroundColor: "rgb(255, 255, 255)", rotate: 11 }}
              whileHover={animation1}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.image2}
                alt="2"
                className="framer-1blaqj2"
              />
            </motion.div>
            {/* Clip 2 */}
            <motion.img
              src={images.clip}
              alt="clip2"
              className="framer-167j51p pointer-events-none"
              style={{ rotate: 11 }}
            />
          </motion.div>

          {/* Item 3 */}
          <motion.div className="framer-1ab2d3z">
            <motion.div
              className="framer-1p2frbb"
              style={{ backgroundColor: "rgb(255, 255, 255)", rotate: -1 }}
              whileHover={animation2}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.image3}
                alt="3"
                className="framer-1ltagb5"
              />
            </motion.div>
            {/* Clip 3 */}
            <motion.img
              src={images.clip}
              alt="clip3"
              className="framer-1yfblzi pointer-events-none"
              style={{ rotate: -1 }}
            />
          </motion.div>

          {/* Item 4 */}
          <motion.div className="framer-rgwsol">
            <motion.div
              className="framer-1ki9v4n"
              style={{ backgroundColor: "rgb(255, 255, 255)", rotate: -12 }}
              whileHover={animation3}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.image4}
                alt="4"
                className="framer-1h4bf3a"
              />
            </motion.div>
            {/* Clip 4 */}
            <motion.img
              src={images.clip}
              alt="clip4"
              className="framer-n2fmoo pointer-events-none"
              style={{ rotate: -12 }}
            />
          </motion.div>

          {/* Item 5 */}
          <motion.div
            className="framer-lllr6z"
            style={{ rotate: -12 }}
          >
            <motion.div
              className="framer-it6tlz"
              style={{ backgroundColor: "rgb(255, 255, 255)", rotate: -12 }}
              whileHover={animation4}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.image5}
                alt="5"
                className="framer-1cprwqt"
              />
            </motion.div>
            {/* Clip 5 */}
            <motion.img
              src={images.clip}
              alt="clip5"
              className="framer-x2u5hu pointer-events-none"
              style={{ rotate: -12 }}
            />
          </motion.div>
        </div>
      </div>

      {/* ── Standings / Achievements List ── */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <h3
          className="text-base sm:text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2"
          style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
        >
          <Trophy size={18} className="text-amber-500" />
          Honors & Hackathon Standings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {achievementsList.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-4 flex items-start justify-between gap-3 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
                <div className="min-w-0">
                  <h4
                    className="font-bold text-slate-900 text-sm truncate"
                    style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-slate-500 text-xs truncate mt-0.5"
                    style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
                  >
                    {item.venue}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {item.prize}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded CSS rules matching Framer component exactly */}
      <style jsx global>{`
        .framer-13v7yhu {
          height: 501px;
          overflow: visible;
          position: relative;
          width: 1288px;
        }
        .framer-82wzl3 {
          align-content: center;
          align-items: center;
          display: flex;
          flex: none;
          flex-direction: column;
          flex-wrap: nowrap;
          gap: 10px;
          height: min-content;
          justify-content: center;
          left: 51%;
          overflow: clip;
          padding: 0px;
          position: absolute;
          top: 0px;
          width: 1200px;
        }
        .framer-lek6dv {
          height: 304px;
          position: relative;
          width: 1326px;
        }
        .framer-yzuj3h {
          flex: none;
          height: 330px;
          left: 9px;
          overflow: visible;
          position: absolute;
          top: calc(51.69660678642717% - 330px / 2);
          width: 266px;
        }
        .framer-5g2h11 {
          align-content: center;
          align-items: center;
          bottom: 32px;
          display: flex;
          flex: none;
          flex-direction: column;
          flex-wrap: nowrap;
          gap: 10px;
          height: 181px;
          justify-content: center;
          left: calc(45.4887218045113% - 177px / 2);
          overflow: clip;
          padding: 16px;
          position: absolute;
          width: 177px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        .framer-1q3jk6e {
          flex: none;
          height: 133px;
          left: 109px;
          overflow: visible;
          position: absolute;
          top: 25px;
          width: 133px;
        }
        .framer-3i1yhu {
          bottom: 14px;
          flex: none;
          height: 311px;
          left: 263px;
          overflow: visible;
          position: absolute;
          width: 209px;
        }
        .framer-7h50c {
          align-content: center;
          align-items: center;
          bottom: 16px;
          display: flex;
          flex: none;
          flex-direction: column;
          flex-wrap: nowrap;
          gap: 10px;
          height: 181px;
          justify-content: center;
          left: calc(49.760765550239256% - 177px / 2);
          overflow: clip;
          padding: 16px;
          position: absolute;
          width: 177px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        .framer-167j51p {
          flex: none;
          height: 133px;
          left: 62px;
          overflow: visible;
          position: absolute;
          top: 12px;
          width: 133px;
        }
        .framer-1ab2d3z {
          bottom: 0px;
          flex: none;
          height: 289px;
          left: calc(49.378881987577664% - 182px / 2);
          overflow: visible;
          position: absolute;
          width: 182px;
        }
        .framer-1p2frbb {
          align-content: center;
          align-items: center;
          bottom: 2px;
          display: flex;
          flex: none;
          flex-direction: column;
          flex-wrap: nowrap;
          gap: 10px;
          height: 181px;
          justify-content: center;
          left: calc(50% - 177px / 2);
          overflow: clip;
          padding: 16px;
          position: absolute;
          width: 177px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        .framer-1yfblzi {
          flex: none;
          height: 133px;
          left: calc(46.15384615384618% - 133px / 2);
          overflow: visible;
          position: absolute;
          top: 2px;
          width: 133px;
        }
        .framer-rgwsol {
          bottom: 6px;
          flex: none;
          height: 311px;
          overflow: visible;
          position: absolute;
          right: 281px;
          width: 216px;
        }
        .framer-1ki9v4n {
          align-content: center;
          align-items: center;
          bottom: 16px;
          display: flex;
          flex: none;
          flex-direction: column;
          flex-wrap: nowrap;
          gap: 10px;
          height: 181px;
          justify-content: center;
          left: calc(51.38888888888891% - 177px / 2);
          overflow: clip;
          padding: 16px;
          position: absolute;
          width: 177px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        .framer-n2fmoo {
          flex: none;
          height: 133px;
          overflow: visible;
          position: absolute;
          right: 70px;
          top: 13px;
          width: 133px;
        }
        .framer-lllr6z {
          flex: none;
          height: 311px;
          overflow: visible;
          position: absolute;
          right: 30px;
          top: calc(53.09381237524953% - 311px / 2);
          width: 216px;
        }
        .framer-it6tlz {
          align-content: center;
          align-items: center;
          bottom: 17px;
          display: flex;
          flex: none;
          flex-direction: column;
          flex-wrap: nowrap;
          gap: 10px;
          height: 181px;
          justify-content: center;
          left: calc(50.92592592592595% - 177px / 2);
          overflow: clip;
          padding: 16px;
          position: absolute;
          width: 177px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        .framer-x2u5hu {
          flex: none;
          height: 133px;
          overflow: visible;
          position: absolute;
          right: 70px;
          top: 13px;
          width: 133px;
        }
        .framer-19pgdqx,
        .framer-1blaqj2,
        .framer-1ltagb5,
        .framer-1h4bf3a,
        .framer-1cprwqt {
          flex: 1 0 0px;
          height: 100%;
          width: 100%;
          object-fit: cover;
          position: relative;
        }
      `}</style>
    </section>
  );
}
