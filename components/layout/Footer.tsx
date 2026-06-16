import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-2 border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Built with <Heart className="inline w-4 h-4 text-error" /> for blind solvers
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Old Pochmann Method</span>
            <span>SiGN Notation</span>
            <span>Speffz Letter Scheme</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
