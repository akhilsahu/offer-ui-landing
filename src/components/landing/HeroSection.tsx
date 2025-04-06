import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  DollarSign,
  BarChart,
  Zap,
  Users,
  Globe,
  ChevronRight,
  Gift,
  Tag,
  Bookmark,
  Percent,
  ShoppingBag,
  Heart,
  Star,
  Award,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAppNavigation } from '@/hooks/use-navigation';
import '@/styles/HeroSection.css';

// List of icons to use for the falling animation
const iconComponents = [
  Gift,
  Tag,
  Bookmark,
  Percent,
  ShoppingBag,
  Heart,
  Star,
  Award,
  Truck,
];

// Component for a single falling icon
const FallingIcon = ({
  IconComponent,
  style,
  size,
}: {
  IconComponent: React.ElementType;
  style: React.CSSProperties;
  size: 'small' | 'medium' | 'large';
}) => {
  return (
    <div className={`falling-icon ${size}`} style={style}>
      <IconComponent className="h-full w-full" />
    </div>
  );
};

// Component for all falling icons
const FallingIcons = () => {
  const [icons, setIcons] = useState<
    Array<{
      id: number;
      Icon: React.ElementType;
      left: string;
      duration: number;
      delay: number;
      size: 'small' | 'medium' | 'large';
      swayAmount: number;
    }>
  >([]);

  useEffect(() => {
    // Create 50 random icons (increased from 20 to 50 for more density)
    const newIcons = Array.from({ length: 50 }, (_, i) => {
      const randomIcon =
        iconComponents[Math.floor(Math.random() * iconComponents.length)];
      const sizes = ['small', 'medium', 'large'] as const;
      // More weighted distribution toward small and medium icons for density
      const sizeDistribution = [
        ...sizes,
        'small',
        'small',
        'medium',
        'medium',
        'small',
      ];
      const selectedSize =
        sizeDistribution[Math.floor(Math.random() * sizeDistribution.length)];

      return {
        id: i,
        Icon: randomIcon,
        left: `${Math.random() * 100}%`,
        duration: 5 + Math.random() * 15, // Faster durations (5-20s instead of 10-30s)
        delay: Math.random() * 15, // More staggered delays
        size: selectedSize,
        swayAmount: 0.5 + Math.random() * 1.5, // Reduced sway for denser packing
      };
    });
    setIcons(newIcons);
  }, []);

  return (
    <div className="falling-icons-container">
      {icons.map((icon) => (
        <FallingIcon
          key={icon.id}
          IconComponent={icon.Icon}
          style={{
            left: icon.left,
            animationDuration: `${icon.duration}s, ${2 + Math.random() * 3}s, ${
              8 + Math.random() * 7
            }s, ${3 + Math.random() * 7}s`,
            animationDelay: `${icon.delay}s, ${icon.delay}s, 0s, 0s`,
            transform: `scale(${0.4 + Math.random() * 0.4})`,
          }}
          size={icon.size}
        />
      ))}
    </div>
  );
};

export function HeroSection() {
  const navigate = useNavigate();
  const { goToSignup, goToLogin } = useAppNavigation();

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="hero-container bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="hero-gradient"></div>
      <FallingIcons />

      {/* Hero Section */}
      <section className="hero-content relative flex min-h-screen flex-col items-center justify-center text-center pt-20 lg:pt-40 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="hero-heading text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
            ⚡ Connecting users to offers.
          </h1>
          <p className="hero-subtext text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            Connect brands with presenters for high-impact marketing
            campaigns.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => goToSignup('brand')}
                className="hero-cta-button rounded-full text-white px-8 py-6 text-lg font-medium"
              >
                Join as a Brand
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => goToSignup('presenter')}
                className="hero-secondary-button rounded-full bg-transparent text-white hover:bg-white/10 px-8 py-6 text-lg font-medium"
              >
                Join as a Presenter
              </Button>
            </motion.div>
          </div>

          <p className="mt-6 text-gray-400">
            Already have an account?
            <Button
              variant="link"
              className="text-purple-400 hover:text-purple-300 pl-1.5"
              onClick={() => goToLogin()}
            >
              Sign in
            </Button>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute -bottom-10 left-0 right-0 flex justify-center"
        >
          <div className="w-full max-w-6xl">
            <div className="relative h-20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-blue-600/20 backdrop-blur-xl rounded-t-3xl"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section bg-gray-900 py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="why-choose-heading text-4xl md:text-5xl font-bold mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Our platform provides a seamless connection between brands and
              presenters, creating a powerful ecosystem for marketing success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="why-choose-card feature-card-float bg-gray-800/50 p-8 rounded-xl border border-gray-700"
            >
              <div className="why-choose-icon">
                <ShieldCheck className="h-8 w-8 text-white relative z-10" />
              </div>
              <h3 className="feature-heading text-xl font-bold mb-4">
                Secure Transactions
              </h3>
              <p className="text-gray-300">
                All financial transactions are secured with industry-leading
                encryption and verified payment systems.
              </p>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="why-choose-card feature-card-float-reverse bg-gray-800/50 p-8 rounded-xl border border-gray-700"
            >
              <div className="why-choose-icon">
                <BarChart className="h-8 w-8 text-white relative z-10" />
              </div>
              <h3 className="feature-heading text-xl font-bold mb-4">
                Detailed Analytics
              </h3>
              <p className="text-gray-300">
                Access comprehensive analytics and performance metrics to
                optimize your marketing campaigns.
              </p>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="why-choose-card feature-card-float bg-gray-800/50 p-8 rounded-xl border border-gray-700"
            >
              <div className="why-choose-icon">
                <Zap className="h-8 w-8 text-white relative z-10" />
              </div>
              <h3 className="feature-heading text-xl font-bold mb-4">
                Fast Matching
              </h3>
              <p className="text-gray-300">
                Our AI-powered matching system connects brands with the perfect
                presenters for their target audience.
              </p>
            </motion.div>

            {/* Feature Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="why-choose-card feature-card-float-reverse bg-gray-800/50 p-8 rounded-xl border border-gray-700"
            >
              <div className="why-choose-icon">
                <DollarSign className="h-8 w-8 text-white relative z-10" />
              </div>
              <h3 className="feature-heading text-xl font-bold mb-4">
                Competitive Pricing
              </h3>
              <p className="text-gray-300">
                Transparent, competitive pricing with no hidden fees. Pay only
                for actual engagement.
              </p>
            </motion.div>

            {/* Feature Card 5 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="why-choose-card feature-card-float bg-gray-800/50 p-8 rounded-xl border border-gray-700"
            >
              <div className="why-choose-icon">
                <Users className="h-8 w-8 text-white relative z-10" />
              </div>
              <h3 className="feature-heading text-xl font-bold mb-4">
                Global Community
              </h3>
              <p className="text-gray-300">
                Join a worldwide network of brands and presenters to expand your
                marketing reach globally.
              </p>
            </motion.div>

            {/* Feature Card 6 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="why-choose-card feature-card-float-reverse bg-gray-800/50 p-8 rounded-xl border border-gray-700"
            >
              <div className="why-choose-icon">
                <Globe className="h-8 w-8 text-white relative z-10" />
              </div>
              <h3 className="feature-heading text-xl font-bold mb-4">
                Multi-Platform Support
              </h3>
              <p className="text-gray-300">
                Promote across multiple social media platforms and websites with
                integrated tracking.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center mt-16"
          >
            <Button
              onClick={() => goToSignup('brand')}
              className="glow-on-hover bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-8 py-6 text-lg font-medium"
            >
              Get Started Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* <section className="stats-section">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Platform Statistics
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Our growing network continues to deliver exceptional results for brands and presenters alike.
            </p>  
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="stat-card bg-gray-800/50 p-6 text-center"
            >
              <div className="stat-number text-4xl font-bold mb-2">1000+</div>
              <div className="stat-label">Active Brands</div>  
            </motion.div>
            
          
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="stat-card bg-gray-800/50 p-6 text-center"
            >
               <div className="stat-number text-4xl font-bold mb-2">10,000+</div>
              <div className="stat-label">Presenters</div>  
            </motion.div>
            
             
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="stat-card bg-gray-800/50 p-6 text-center"
            >
               <div className="stat-number text-4xl font-bold mb-2">$5M+</div>
              <div className="stat-label">Monthly Revenue</div> 
            </motion.div>
            
           
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="stat-card bg-gray-800/50 p-6 text-center"
            >
                <div className="stat-number text-4xl font-bold mb-2">25M+</div>
              <div className="stat-label">Monthly Clicks</div>  
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Footer CTA */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Grow Your Business?
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg mb-10">
              Join thousands of brands and presenters who are already
              experiencing the benefits of our platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => goToSignup('brand')}
                  className="hero-cta-button rounded-full text-white px-8 py-6 text-lg font-medium"
                >
                  Start as a Brand
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => goToSignup('presenter')}
                  className="hero-secondary-button rounded-full bg-transparent text-white hover:bg-white/10 px-8 py-6 text-lg font-medium"
                >
                  Start as a Presenter
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-aqua-900 to-black py-24">
        <div className="container max-w-5xl flex-wrap justify-center flex flex-wrap  gap-4 mx-auto px-4 text-center">
          <Link
            to="/privacy-policy"
            className=" text-white-900 px-3 py-2 rounded-md  bg-gradient-to-r      hover:text-white transition-colors hover:border-teal-800"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className=" text-white-800 px-3 py-2 rounded-md  bg-gradient-to-r     hover:text-white transition-colors hover:border-teal-800"
          >
            Terms and Conditions
          </Link>
          <Link
            to="/about-us"
            className="  text-white-800 px-3 py-2 rounded-md  bg-gradient-to-r    hover:text-white transition-colors hover:border-teal-800"
          >
            About Us
          </Link>
          <Link
            to="/contact-us"
            className=" text-white-800 px-3 py-2 rounded-md  bg-gradient-to-r   hover:text-white   transition-colors hover:border-teal-800"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
