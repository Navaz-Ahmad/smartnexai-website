import Image from 'next/image';

// Added types to this component
const TeamMember = ({ name, role, imageUrl }: { name: string; role: string; imageUrl: string }) => (
  <div className="text-center">
    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-gray-700">
        <Image src={imageUrl} alt={name} layout="fill" objectFit="cover" />
    </div>
    <h3 className="mt-4 text-xl font-semibold text-white">{name}</h3>
    <p className="text-accent">{role}</p>
  </div>
);

export default function AboutPage() {
  return (
    <div className="animate-fade-in-up">
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gradient">About SmartNex.ai</h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-gray-300">
            We are a team of pioneers, innovators, and problem-solvers dedicated to harnessing the transformative power of Artificial Intelligence.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-800/30">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            <p className="mt-4 text-gray-400">
              To empower businesses across the globe by providing accessible, cutting-edge AI technologies. We strive to create intelligent systems that drive efficiency, foster innovation, and unlock new opportunities for growth, making the future of AI a present reality for our clients.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Our Vision</h2>
            <p className="mt-4 text-gray-400">
              To be a global leader in AI innovation, creating a future where intelligent technology is seamlessly integrated into every aspect of business, enhancing human potential and solving the world’s most complex challenges.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Meet Our Team</h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <TeamMember name="Dr. Evelyn Reed" role="Founder & CEO" imageUrl="https://placehold.co/200x200/1E88E5/FFFFFF?text=ER" />
            <TeamMember name="Marcus Chen" role="Chief Technology Officer" imageUrl="https://placehold.co/200x200/1E88E5/FFFFFF?text=MC" />
            <TeamMember name="Alina Petrova" role="Head of Research" imageUrl="https://placehold.co/200x200/1E88E5/FFFFFF?text=AP" />
            <TeamMember name="Kenji Tanaka" role="Lead AI Engineer" imageUrl="https://placehold.co/200x200/1E88E5/FFFFFF?text=KT" />
          </div>
        </div>
      </section>
    </div>
  );
}