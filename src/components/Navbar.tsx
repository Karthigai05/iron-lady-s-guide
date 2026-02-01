import { Link, useLocation } from "react-router-dom";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center group-hover:scale-105 transition-transform">
            <Crown className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">Iron Lady</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            to="/admin"
            className={`text-sm font-medium transition-colors ${
              isAdmin ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Admin Dashboard
          </Link>
          <Button asChild className="hero-gradient">
            <a href="#programs">Explore Programs</a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
