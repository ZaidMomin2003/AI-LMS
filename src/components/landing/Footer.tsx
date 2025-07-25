
import { BookOpenCheck, Linkedin } from "lucide-react";
import Link from 'next/link';

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="h-5 w-5 text-primary" />
          <p className="text-sm font-semibold">ScholarAI</p>
        </div>
        
        <div className="text-sm text-muted-foreground flex flex-col sm:flex-row items-center gap-4">
            <span>© {new Date().getFullYear()} ScholarAI. All rights reserved.</span>
            <div className="flex gap-4">
                <Link href="/terms" className="hover:text-foreground">Terms</Link>
                <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                <Link href="/refund-policy" className="hover:text-foreground">Refunds</Link>
                <Link href="/developer" className="hover:text-foreground">Developer</Link>
            </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Made with ❤️ by Arshad</span>
          <div className="flex items-center gap-2">
            <Link href="https://www.linkedin.com/in/arshad-momin-a3139b21b" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </Link>
             <Link href="https://github.com/ZaidMomin2003" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <GitHubIcon />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
