
import { BookOpenCheck } from "lucide-react";
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-md">
              <BookOpenCheck className="h-5 w-5" />
           </div>
          <div className="flex flex-col">
              <p className="font-bold font-headline text-lg -mb-1">Wisdom</p>
              <p className="text-xs text-muted-foreground">AI Studybuddy</p>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground flex flex-col sm:flex-row items-center gap-4">
            <span>© {new Date().getFullYear()} Wisdom. All rights reserved.</span>
            <div className="flex gap-4">
                <Link href="/terms" className="hover:text-foreground">Terms</Link>
                <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                <Link href="/refund-policy" className="hover:text-foreground">Refunds</Link>
                <Link href="/developer" className="hover:text-foreground">Developer</Link>
            </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Made with ❤️ by Arshad</span>
        </div>
      </div>
    </footer>
  );
}
