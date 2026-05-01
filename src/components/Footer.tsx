import { Container } from './UI';

const logosSrc = `${(import.meta as any).env?.BASE_URL || '/'}${encodeURIComponent('Logos SM.png')}`;

const SocialIcon = ({ href, label, position }: { href: string; label: string; position: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="hover:opacity-80 transition-opacity"
  >
    <div
      style={{
        width: '36px',
        height: '36px',
        backgroundImage: `url(${logosSrc})`,
        backgroundSize: '200% 100%',
        backgroundPosition: position,
        backgroundRepeat: 'no-repeat',
      }}
    />
  </a>
);

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-black/5 py-8">
      <Container className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[12px] text-secondary">
          &copy; {new Date().getFullYear()} Global Gate México
        </div>

        <div className="flex items-center gap-4">
          <SocialIcon
            href="https://www.instagram.com/globalgatemexico"
            label="Instagram"
            position="0% 50%"
          />
          <SocialIcon
            href="https://www.linkedin.com/company/globalgatemexico"
            label="LinkedIn"
            position="100% 50%"
          />
        </div>
      </Container>
    </footer>
  );
};
