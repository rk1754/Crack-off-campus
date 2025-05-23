
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";

const DashboardHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/logo.png" 
                alt="Foundit Logo" 
                className="h-8 w-auto mr-2"
              />
              <span className="font-bold text-lg text-foreground">Admin</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/admin" className="text-foreground hover:text-primary-foreground transition-colors">
              <Button variant="ghost" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/" className="text-foreground hover:text-primary-foreground transition-colors">
              <Button variant="ghost" className="flex items-center gap-2">
                View Site
              </Button>
            </Link>
            <ThemeToggle />
            <Button variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/admin" 
                className="px-4 py-2 rounded hover:bg-accent flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                to="/" 
                className="px-4 py-2 rounded hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                View Site
              </Link>
              <Button variant="outline" className="flex items-center gap-2 mt-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
