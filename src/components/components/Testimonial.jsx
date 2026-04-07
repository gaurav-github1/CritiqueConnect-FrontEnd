import React from 'react';
import { motion } from 'framer-motion';

const founders = [
  {
    name: "Nikhil Raikwar",
    role: "Tech Lead",
    bio: "Architects the technical backbone of CritiqueConnect — designing scalable systems, driving engineering decisions, and ensuring the platform runs at peak performance.",
    image: "https://ui-avatars.com/api/?name=Nikhil+Raikwar&background=0A84FF&color=ffffff&size=256&bold=true&font-size=0.4",
    linkedin: "https://www.linkedin.com/in/nikhil-raikwar-102ab636b/",
    accent: "#0A84FF",
  },
  {
    name: "Gaurav Verma",
    role: "Product Specialist",
    bio: "Defines the product vision and user experience of CritiqueConnect — bridging the gap between technical capability and real-world user needs with precision design.",
    image: "https://ui-avatars.com/api/?name=Gaurav+Verma&background=BF5AF2&color=ffffff&size=256&bold=true&font-size=0.4",
    linkedin: "https://www.linkedin.com/in/gauravdeve/",
    accent: "#BF5AF2",
  },
  {
    name: "Md Anas",
    role: "AI Specialist",
    bio: "Powers the intelligent feedback layer of CritiqueConnect — building and deploying the ML models that analyze sentiment, categorize submissions, and surface key insights.",
    image: "https://ui-avatars.com/api/?name=Md+Anas&background=30D158&color=ffffff&size=256&bold=true&font-size=0.4",
    linkedin: "https://www.linkedin.com/in/mohd-anas-919275251/",
    accent: "#30D158",
  },
  {
    name: "Hritik Roushan",
    role: "AI Researcher",
    bio: "Explores the frontier of AI to bring next-generation capabilities to CritiqueConnect — from advanced NLP pipelines to research-backed improvements in automated review quality.",
    image: "https://ui-avatars.com/api/?name=Hritik+Roushan&background=FF9F0A&color=ffffff&size=256&bold=true&font-size=0.4",
    linkedin: "https://www.linkedin.com/in/hritik-roushan-b9aa03256/",
    accent: "#FF9F0A",
  }
];

const FounderCard = ({ founder, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay: index * 0.12, type: "spring", stiffness: 90, damping: 15 }}
    className="group relative"
  >
    <div className="card-solid-light rounded-[2rem] p-8 h-full flex flex-col items-center text-center transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)] overflow-hidden relative">
      
      {/* Per-card accent color top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem]" style={{ backgroundColor: founder.accent }} />

      {/* Subtle orb behind avatar */}
      <div
        className="absolute top-6 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: founder.accent }}
      />

      {/* Avatar */}
      <div className="relative mb-6 w-28 h-28 mt-4">
        <img
          src={founder.image}
          alt={founder.name}
          className="w-full h-full rounded-full object-cover bg-white ring-4 ring-white shadow-md relative z-10"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{ borderColor: founder.accent }}
        />
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-[var(--text-on-light)] mb-1 transition-colors duration-300" style={{ '--hover-color': founder.accent }}>
        {founder.name}
      </h3>

      {/* Role tag */}
      <div
        className="text-xs font-semibold mb-5 px-3 py-1 rounded-full tracking-widest uppercase"
        style={{ color: founder.accent, backgroundColor: `${founder.accent}15` }}
      >
        {founder.role}
      </div>

      {/* Bio */}
      <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
        {founder.bio}
      </p>

      {/* LinkedIn */}
      <a
        href={founder.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400 transition-all duration-300 hover:scale-110"
        style={{ '--hover-bg': founder.accent }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = founder.accent; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      </a>
    </div>
  </motion.div>
);

const FoundersSection = () => {
  return (
    <section id="founders" className="relative bg-[var(--surface-light)] py-32 font-ui overflow-hidden">

      {/* Very subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1D1D1F 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block mb-5 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[var(--accent)] bg-[var(--accent)]/10 rounded-full border border-[var(--accent)]/20">
            The People Behind It
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-on-light)] tracking-tight">
            Meet the <span className="text-[var(--accent)]">Founding Team</span>
          </h2>
          <p className="max-w-xl mx-auto mt-5 text-gray-500 font-medium">
            Four builders on a mission to make expert feedback accessible to everyone.
          </p>
        </motion.div>

        {/* Cards Grid — 2 cols on md, 4 cols on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {founders.map((founder, index) => (
            <FounderCard key={index} founder={founder} index={index} />
          ))}
        </div>
      </div>

    </section>
  );
};

export default FoundersSection;
