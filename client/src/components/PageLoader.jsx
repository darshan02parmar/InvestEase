import React, { useEffect, useState } from 'react';

const PageLoader = () => {
  // Cycles through a couple of reassuring status lines so a longer load
  // doesn't feel stuck on one static word.
  const messages = ['Securing session...', 'Loading your portfolio...'];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#F5F7FB]">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Outer ring - slow, deliberate rotation instead of the default 1s spin */}
        <div
          className="absolute h-20 w-20 rounded-full border-4 border-gray-100 border-t-teal-600"
          style={{ animation: 'ie-spin 1.6s cubic-bezier(0.65, 0, 0.35, 1) infinite' }}
        ></div>

        {/* Inner ring - opposite direction, slightly offset timing for depth */}
        <div
          className="absolute h-12 w-12 rounded-full border-[3px] border-transparent border-b-teal-300"
          style={{ animation: 'ie-spin-reverse 2.4s linear infinite' }}
        ></div>

        {/* Static logo mark - gentle scale breathing, not opacity flicker */}
        <div
          className="absolute h-10 w-10 rounded-xl bg-navy-900 shadow-md flex items-center justify-center"
          style={{ animation: 'ie-breathe 2.2s ease-in-out infinite' }}
        >
          <span className="text-white font-black text-sm tracking-tighter">IE</span>
        </div>
      </div>

      {/* Status text with a soft crossfade between messages */}
      <p
        key={msgIndex}
        className="mt-6 font-outfit text-xs font-bold text-navy-500 uppercase tracking-widest"
        style={{ animation: 'ie-fade-in 0.5s ease-out' }}
      >
        {messages[msgIndex]}
      </p>

      {/* Three-dot progress indicator, staggered - reads as "working", not "frozen" */}
      <div className="mt-3 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-teal-600"
            style={{
              animation: 'ie-dot 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          ></span>
        ))}
      </div>

      <style>{`
        @keyframes ie-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ie-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes ie-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes ie-fade-in {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ie-dot {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
