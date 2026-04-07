import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import avatar from '../assets/images/avatar.jpg';

const FoundersSection = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  const founders = [
    {
      name: "Nikhil Raikwar",
      role: "Tech Lead",
      contribution: "Architected the core platform and led the development of our innovative feedback system."
    },
    {
      name: "Gaurav Verma",
      role: "Product Strategist",
      contribution: "Shaped the product vision and guided the platform's development to meet real-world needs."
    },
    {
      name: "Mohd Anas",
      role: "UX Designer",
      contribution: "Created the intuitive user experience that makes giving and receiving feedback seamless."
    },
    {
      name: "Aakash Singh",
      role: "Marketing & Growth",
      contribution: "Drives our outreach strategy and builds relationships with communities and organizations."
    }
  ];

  return (
    <section id='founders' className="bg-[#050505] pt-32 pb-20 font-ui relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
      
      <div ref={ref} className='max-w-6xl px-5 mx-auto mt-12 text-center relative z-10'>
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='text-3xl md:text-4xl font-extrabold text-center mb-16'
        >
          <span className="text-white">
            Meet Our Founding Team
          </span>
        </motion.h2>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16'>
          {founders.map((founder, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
              className='flex flex-col items-center p-6 space-y-4 rounded-2xl bg-[#0a0a0f] border border-[rgba(255,255,255,0.06)] shadow-xl relative group'
            >
              <motion.div 
                whileHover={{ scale: 1.1, boxShadow: "0 0 0 4px rgba(34, 211, 238, 0.4)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className='w-24 h-24 -mt-14 rounded-full bg-[#050505] p-1'
              >
                <img 
                  src={avatar} 
                  className='w-full h-full rounded-full object-cover' 
                  alt={founder.name} 
                />
              </motion.div>
              <h5 className='text-lg font-bold text-gray-200 mt-2'>{founder.name}</h5>
              <p className='text-sm font-medium text-[#22d3ee]'>{founder.role}</p>
              <p className='text-sm text-gray-400 group-hover:text-gray-300 transition-colors'>
                {founder.contribution}
              </p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className='my-16'
        >
          <Link
            to='/about-us'
            className='inline-block px-8 py-3 text-[#22d3ee] font-medium border border-[#22d3ee]/30 rounded-full transition-all duration-300 hover:bg-[#22d3ee]/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:border-[#22d3ee]'
          >
            Learn More About Our Team
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FoundersSection;
