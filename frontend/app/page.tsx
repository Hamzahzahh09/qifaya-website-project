'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  RefreshCcw,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.1]);

  const categories = [
    { name: 'Abaya Exclusive', image: 'https://images.unsplash.com/photo-1631230322206-58605a639686?auto=format&fit=crop&q=80&w=800', count: '45+ Items' },
    { name: 'Gamis Modern', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800', count: '32+ Items' },
    { name: 'Koko / Kurta', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800', count: '28+ Items' },
    { name: 'Khimar & Pashmina', image: 'https://images.unsplash.com/photo-1555364486-1458025e70d4?auto=format&fit=crop&q=80&w=800', count: '15+ Items' },
  ];

  const featuredProducts = [
    { id: 1, name: 'Sultana Silk Abaya', price: 'Rp 459.000', image: 'https://images.unsplash.com/photo-1631230322206-58605a639686?auto=format&fit=crop&q=80&w=600', rating: 4.8 },
    { id: 2, name: 'Malik Linen Koko', price: 'Rp 289.000', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=600', rating: 4.9 },
    { id: 3, name: 'Zahra Velvet Gamis', price: 'Rp 559.000', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600', rating: 5.0 },
    { id: 4, name: 'Premium Ceruty Pashmina', price: 'Rp 95.000', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=600', rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-[#6D1B1B]">
            QIFAYA
          </Link>

          <div className="hidden lg:flex gap-8 items-center text-sm font-medium text-[#4A4A4A]">
            <a href="#" className="hover:text-black transition-colors">New Arrivals</a>
            <a href="#" className="hover:text-black transition-colors">Women</a>
            <a href="#" className="hover:text-black transition-colors">Men</a>
            <a href="#" className="hover:text-black transition-colors">Our Story</a>
          </div>

          <div className="flex gap-4 items-center">
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <ShoppingBag size={20} />
            </button>
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/auth">
              <button className="hidden sm:block bg-[#1C1C1C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black/90 transition-all">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/20 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1920"
            alt="Hero Fashion"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        <div className="container mx-auto px-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-white/80 text-sm font-medium tracking-[0.2em] mb-4 uppercase">New Collection 2024</span>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
              Grace in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic font-serif">Modesty</span>
            </h1>
            <p className="text-white/70 text-lg mb-10 max-w-md font-light leading-relaxed">
              Discover the perfect blend of traditional values and modern elegance. Handcrafted pieces for your spiritual and stylish journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-white/10">
                Explore Collection <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border border-white/30 text-white backdrop-blur-sm px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all">
                View Lookbook
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white border-b border-zinc-100">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <ShieldCheck className="text-zinc-400" />, title: 'Premium Quality', desc: 'Sourced from fine fabrics' },
            { icon: <Truck className="text-zinc-400" />, title: 'Global Shipping', desc: 'Secure worldwide delivery' },
            { icon: <RefreshCcw className="text-zinc-400" />, title: 'Easy Returns', desc: '30-day hassle-free return' },
            { icon: <Star className="text-zinc-400" />, title: '10k+ Reviews', desc: 'Trusted by our community' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-zinc-50 rounded-2xl">{item.icon}</div>
              <h3 className="font-semibold text-sm text-[#1C1C1C]">{item.title}</h3>
              <p className="text-xs text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#1C1C1C] mb-2">Shop by Category</h2>
              <p className="text-zinc-500">Find your perfect fit for any occasion</p>
            </div>
            <button className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Browse All <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative h-[400px] overflow-hidden rounded-3xl cursor-pointer"
              >
                <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1">{cat.count}</p>
                  <h3 className="text-xl font-bold">{cat.name}</h3>
                </div>
                <div className="absolute bottom-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowRight size={16} className="text-black" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1C1C1C] mb-4">Trending Now</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">Selected by our designers, these pieces represent the best of Qifaya's craftsmanship.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4 bg-zinc-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                    <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white">
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                  {product.rating > 4.8 && (
                    <div className="absolute top-4 left-4 bg-black/80 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-sm">
                      MUST HAVE
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-[#1C1C1C] group-hover:text-black/60 transition-colors uppercase tracking-tight text-sm">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] text-zinc-400 mt-0.5">{product.rating}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#1C1C1C]">{product.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1C1C1C] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 translate-x-32" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Join the Qifaya Elite</h2>
            <p className="text-zinc-400 mb-10 leading-relaxed">Subscribe to receive exclusive access to our new drops, limited editions, and hidden discounts.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-full py-4 px-6 text-white text-sm focus:outline-none focus:border-white/40 transition-all"
              />
              <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-zinc-200 transition-all">
                Subscribe
              </button>
            </form>
            <p className="text-[10px] text-zinc-500 mt-6 tracking-wider uppercase">Privacy protected. Cancel anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="text-2xl font-bold tracking-tighter mb-6">QIFAYA</div>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                Redefining modest fashion through modern design and traditional values. Committed to sustainable and ethical craftsmanship.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 border border-zinc-100 rounded-full hover:bg-zinc-50 transition-colors"><Instagram size={18} /></a>
                <a href="#" className="p-2 border border-zinc-100 rounded-full hover:bg-zinc-50 transition-colors"><Facebook size={18} /></a>
                <a href="#" className="p-2 border border-zinc-100 rounded-full hover:bg-zinc-50 transition-colors"><Twitter size={18} /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest">Shop</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-black transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Women's Collection</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Men's Collection</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Sale</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-black transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Ethical Sourcing</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Journal</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest">Support</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-black transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Returns & Exchanges</a></li>
                <li><a href="#" className="hover:text-black transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Size Guide</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100 flex flex-col md:row justify-between items-center text-[10px] text-zinc-400 font-medium tracking-widest uppercase">
            <p>© 2024 QIFAYA EXCLUSIVE. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
