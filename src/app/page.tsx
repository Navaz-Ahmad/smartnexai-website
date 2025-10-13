import Link from 'next/link';

// Simple icon component for features
const FeatureIcon = ({ path }: { path: string }) => (
  <svg className="w-8 h-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

export default function Home() {
  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Revolutionizing Industries with <br />
            <span className="text-gradient">Artificial Intelligence</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
            We build custom, scalable, and intelligent solutions that empower your business to innovate and lead in the digital age.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/services" className="bg-accent text-dark-bg font-semibold py-3 px-8 rounded-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105">
              Explore Services
            </Link>
            <Link href="/contact" className="bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-600 transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Why SmartNex.ai?</h2>
            <p className="mt-4 text-gray-400">Driving results through innovation and expertise.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-8 rounded-lg text-center">
              <FeatureIcon path="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" />
              <h3 className="mt-4 text-xl font-semibold text-white">Custom Solutions</h3>
              <p className="mt-2 text-gray-400">Tailor-made AI models that fit your unique business challenges and goals.</p>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-lg text-center">
              <FeatureIcon path="M13 10V3L4 14h7v7l9-11h-7z" />
              <h3 className="mt-4 text-xl font-semibold text-white">Scalable Infrastructure</h3>
              <p className="mt-2 text-gray-400">Robust and efficient systems designed to grow with your data and demand.</p>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-lg text-center">
              <FeatureIcon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 12v-1m-4-6H7m10 0h-1" />
              <h3 className="mt-4 text-xl font-semibold text-white">Expert Team</h3>
              <p className="mt-2 text-gray-400">Access to leading AI researchers and engineers dedicated to your success.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}