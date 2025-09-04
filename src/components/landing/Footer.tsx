
import { BookOpenCheck } from "lucide-react";
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="h-5 w-5 text-primary" />
          <p className="text-sm font-semibold">Wisdomis Fun</p>
        </div>
        
        <div className="text-sm text-white/60 flex flex-col sm:flex-row items-center gap-4">
            <span>© {new Date().getFullYear()} Wisdomis Fun. All rights reserved.</span>
            <div className="flex gap-4">
                <Link href="/terms" className="hover:text-white">Terms</Link>
                <Link href="/privacy" className="hover:text-white">Privacy</Link>
                <Link href="/refund-policy" className="hover:text-white">Refunds</Link>
                <Link href="/developer" className="hover:text-white">Developer</Link>
            </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-white/60">
          <span>Made with ❤️ by Arshad</span>
        </div>
      </div>
    </footer>
  );
}
