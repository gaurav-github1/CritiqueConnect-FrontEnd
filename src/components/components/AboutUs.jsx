import React, { useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import avatar from '../assets/images/avatar.jpg';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

const TiltCard = ({ member, index }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 20 });
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  
  const handleMouseLeave = () => {
    x.set(0); y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring" }}
      className="perspective-[1000px] h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="bg-[#0a0a0f] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 h-full flex flex-col hover:border-[#22d3ee]/40 transition-colors group relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee]/0 to-[#22d3ee]/0 group-hover:from-[#22d3ee]/5 transition-colors rounded-2xl -z-10"></div>
        <div style={{ transform: "translateZ(30px)" }} className="flex items-center mb-6">
          <img src={avatar} alt={member.name} className="w-16 h-16 rounded-full grayscale group-hover:grayscale-0 transition-all border border-[rgba(255,255,255,0.1)] group-hover:border-[#22d3ee]" />
          <div className="ml-4">
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <p className="text-[#22d3ee] font-mono text-xs uppercase tracking-widest">{member.role}</p>
          </div>
        </div>
        <p style={{ transform: "translateZ(20px)" }} className="text-gray-400 text-sm leading-relaxed mb-8 flex-1">{member.bio}</p>
        <div style={{ transform: "translateZ(10px)" }} className="mt-auto">
          <div className="flex flex-wrap gap-2">
            {member.expertise.map((skill, i) => (
              <span key={i} className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-gray-400 border border-[rgba(255,255,255,0.1)] rounded bg-[#12121a]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AboutUs = () => {
  const team = [
    {
      name: "Nikhil Raikwar",
      role: "Tech Lead",
      bio: "Nikhil is the technical visionary behind CritiqueConnect. With over 8 years of experience in full-stack development, he architected our platform from the ground up with a focus on scalability and user experience.",
      expertise: ["Architecture", "Backend", "Database", "API"]
    },
    {
      name: "Gaurav Verma",
      role: "Product Strategist",
      bio: "As our product strategist, Gaurav bridges the gap between user needs and technical possibilities. His background in UX research ensures every feature we build serves a genuine purpose.",
      expertise: ["Product", "UX Research", "Strategy", "Growth"]
    },
    {
      name: "Mohd Anas",
      role: "UX Designer",
      bio: "Anas brings creativity and empathy to every screen. His work goes beyond aesthetics to create intuitive workflows that make complex feedback processes feel simple and natural.",
      expertise: ["UI/UX", "User Testing", "Wireframing", "Systems"]
    },
    {
      name: "Hritik Roshan",
      role: "Growth Ops",
      bio: "Hritik leads our outreach and community efforts. With experience in traditional marketing and community management, he's focused on growing our user base while preserving culture.",
      expertise: ["Community", "Strategy", "Partnerships", "Acquisition"]
    }
  ];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#050505] pt-32 pb-16 px-4 font-ui overflow-hidden relative" onMouseMove={e => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}>
        <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ background: useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(34, 211, 238, 0.05), transparent 80%)` }}/>
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] z-0 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-6">
              System <span className="text-[#22d3ee]">Architects</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              We're building a deterministic space where professionals and creators algorithmically refine their concepts through honest, constructive data parameters.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#0a0a0f] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8">
              <h2 className="text-xl font-mono uppercase tracking-widest text-white mb-4 flex items-center"><span className="w-2 h-2 bg-[#22d3ee] mr-3 rounded-full"></span> Origin Protocol</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                CritiqueConnect initialized in 2022 when our founding node noticed a common systemic flaw: obtaining high-fidelity, constructive feedback on works-in-progress had high latency and noise.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                As creators, we authored a dedicated space to compile critiques from peers and professionals, applying strict filters to omit the static often found on general social networks.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#0a0a0f] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8">
              <h2 className="text-xl font-mono uppercase tracking-widest text-[#22d3ee] mb-4 flex items-center"><span className="w-2 h-2 bg-white mr-3 rounded-full"></span> Core Directive</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Quality data input is the primary catalyst for growth algorithms. Our directive is to instantiate an environment where modules can:
              </p>
              <ul className="space-y-2 text-sm text-gray-400 font-mono">
                <li className="flex items-center"><span className="text-[#22d3ee] mr-2">›</span> Deploy schemas without judgment thresholds</li>
                <li className="flex items-center"><span className="text-[#22d3ee] mr-2">›</span> Receive structured, actionable parameters</li>
                <li className="flex items-center"><span className="text-[#22d3ee] mr-2">›</span> Establish encrypted mentor connections</li>
              </ul>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">The Node Cluster</h2>
            <p className="text-[#22d3ee] font-mono text-sm uppercase tracking-widest">Active Maintainers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <TiltCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;