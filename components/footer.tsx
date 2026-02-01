import { memo } from "react";
import Link from "next/link";
import { MapPin, Mail, Phone, Facebook } from "lucide-react";

export const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 pt-8 md:pt-10">
        {/* Navigation */}
        <nav className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <Link
            href="/#hero"
            className="text-sm uppercase tracking-widest text-foreground hover:text-primary transition-colors"
          >
            Főoldal
          </Link>
          <Link
            href="/#kinalat"
            className="text-sm uppercase tracking-widest text-foreground hover:text-primary transition-colors"
          >
            Kínálat
          </Link>
          <Link
            href="/rolunk#szolgaltatasok"
            className="text-sm uppercase tracking-widest text-foreground hover:text-primary transition-colors"
          >
            Szolgáltatások
          </Link>
          <Link
            href="/rolunk#kapcsolat"
            className="text-sm uppercase tracking-widest text-foreground hover:text-primary transition-colors"
          >
            Kapcsolat
          </Link>
        </nav>
      </div>

      {/* Divider */}
      <div className="h-px bg-foreground/10" />

      <div className="container mx-auto px-4 md:px-6 lg:px-12 py-6 md:py-8">
        {/* Contact info */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-12">
          <a
            href="mailto:osvath0911@gmail.com"
            className="flex items-center gap-3 hover:text-primary transition-colors"
          >
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-sm md:text-base">osvath0911@gmail.com</span>
          </a>
          <a
            href="tel:+36706050350"
            className="flex items-center gap-3 hover:text-primary transition-colors"
          >
            <Phone className="w-5 h-5 text-primary" />
            <span className="text-sm md:text-base">+36 70 605 0350</span>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61579638051644"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:text-primary transition-colors"
          >
            <Facebook className="w-5 h-5 text-primary" />
            <span className="text-sm md:text-base">Facebook</span>
          </a>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-sm md:text-base">
              9500 Celldömölk, Magyarország
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-foreground/10 py-6">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} OSICAR. Minden jog fenntartva.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
