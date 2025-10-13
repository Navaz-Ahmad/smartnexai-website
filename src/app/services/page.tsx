// Notice the change on this line to add specific types
const ServiceCard = ({ title, description, iconPath }: { title: string; description: string; iconPath: string }) => (
  <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700 transform hover:-translate-y-2 transition-transform duration-300">
    <svg className="w-10 h-10 text-accent mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
    </svg>
    <h3 className="text-2xl font-bold text-white">{title}</h3>
    <p className="mt-4 text-gray-400">{description}</p>
  </div>
);

export default function ServicesPage() {
  return (
    <div className="animate-fade-in-up">
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gradient">Our Services</h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-gray-300">
            We provide a comprehensive suite of AI services designed to solve your most complex problems and drive business value.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              title="Custom ML Models" 
              description="Development of bespoke machine learning models tailored to your specific data and business objectives, from predictive analytics to computer vision."
              iconPath="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
            />
            <ServiceCard 
              title="AI-Powered Analytics" 
              description="Unlock deep insights from your data. Our advanced analytics platform uses AI to identify trends, predict outcomes, and provide actionable intelligence."
              iconPath="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
            <ServiceCard 
              title="Natural Language Processing" 
              description="Leverage our NLP solutions for sentiment analysis, text summarization, chatbots, and language understanding to enhance customer interaction and automate tasks."
              iconPath="M3 5h12M9 3v2m4 13h4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h6"
            />
             <ServiceCard 
              title="AI Strategy Consulting" 
              description="Work with our experts to develop a roadmap for AI integration. We help you identify opportunities, assess feasibility, and plan for successful implementation."
              iconPath="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
             <ServiceCard 
              title="Data Engineering" 
              description="Building robust data pipelines and infrastructure to ensure your AI models are fed with clean, reliable, and real-time data for optimal performance."
              iconPath="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7l8-4 8 4"
            />
             <ServiceCard 
              title="Automation Solutions" 
              description="Implement intelligent automation to streamline business processes, reduce operational costs, and free up your team to focus on high-value work."
              iconPath="M12 6V4m0 16v-2m8-8h-2M4 12H2m15.364 6.364l-1.414-1.414M6.05 6.05l-1.414-1.414m12.728 0l-1.414 1.414M6.05 17.95l-1.414 1.414"
            />
          </div>
        </div>
      </section>
    </div>
  );
}