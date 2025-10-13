import Link from 'next/link';

const ProductCard = ({ title, description, version }) => (
  <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700 flex flex-col">
    <div className="flex-grow">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <span className="bg-accent/20 text-accent text-xs font-semibold px-2.5 py-0.5 rounded-full">{version}</span>
      </div>
      <p className="mt-4 text-gray-400">{description}</p>
    </div>
    <div className="mt-6">
      <Link href="/contact" className="text-accent font-semibold hover:underline">
        Request a Demo &rarr;
      </Link>
    </div>
  </div>
);

export default function ProductsPage() {
  return (
    <div className="animate-fade-in-up">
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gradient">Our Products</h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-gray-300">
            Proprietary AI platforms designed for performance, scalability, and ease of use.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProductCard 
              title="NexusFlow AI" 
              description="An end-to-end MLOps platform that simplifies the entire machine learning lifecycle, from data preparation and model training to deployment and monitoring."
              version="v2.5"
            />
            <ProductCard 
              title="CogniSynth Platform" 
              description="A powerful generative AI suite for creating high-quality text, code, and images. Perfect for content creation, software development, and design automation."
              version="v1.8"
            />
            <ProductCard 
              title="PredictivePulse" 
              description="Our flagship predictive analytics tool that provides highly accurate forecasts for sales, customer churn, and market trends, helping you make data-driven decisions."
              version="v3.2"
            />
             <ProductCard 
              title="VisionGuard" 
              description="An advanced computer vision solution for real-time object detection, facial recognition, and quality control in manufacturing and security applications."
              version="v4.1"
            />
          </div>
        </div>
      </section>
    </div>
  );
}