import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const PageHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="bg-dark pt-40 pb-20 text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/30 to-transparent" />
    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-12 bg-accent" />
        <span className="text-accent uppercase tracking-widest font-bold text-xs">Global Gate Mexico</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 uppercase">{title}</h1>
      {subtitle && <p className="text-secondary text-lg max-w-2xl font-light">{subtitle}</p>}
    </div>
  </div>
);
