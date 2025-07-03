import { BookOpenCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="h-5 w-5 text-primary" />
          <p className="text-sm font-semibold">ScholarAI</p>
        </div>
        <p className="text-sm text-muted-foreground mt-4 md:mt-0">
          © {new Date().getFullYear()} ScholarAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
