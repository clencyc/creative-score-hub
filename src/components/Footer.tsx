import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Credit Scoring", href: "#features" },
        { name: "Sector Analysis", href: "#sectors" },
        { name: "API Documentation", href: "#api" }
      ]
    },
    {
      title: "Creative Sectors",
      links: [
        { name: "Audio Visual & Media", href: "#sectors" },
        { name: "Design & Creative Services", href: "#sectors" },
        { name: "Books and Press", href: "#sectors" },
        { name: "Performance & Celebration", href: "#sectors" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "User Guide", href: "#guide" },
        { name: "Sector Reports", href: "#reports" },
        { name: "Best Practices", href: "#practices" },
        { name: "Case Studies", href: "#cases" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Contact Us", href: "#contact" },
        { name: "Technical Support", href: "#support" },
        { name: "Training", href: "#training" }
      ]
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "info@heva.fund",
      href: "mailto:info@heva.fund"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+254 700 000 000",
      href: "tel:+254700000000"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Nairobi, Kenya",
      href: "#location"
    },
    {
      icon: Globe,
      title: "Website",
      value: "heva.fund",
      href: "https://heva.fund"
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "#twitter", label: "Twitter" },
    { icon: Linkedin, href: "#linkedin", label: "LinkedIn" },
    { icon: Github, href: "#github", label: "GitHub" },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-heva-purple to-heva-blue">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl text-foreground">HEVA CCI</div>
                  <div className="text-sm text-muted-foreground">Credit Intelligence Platform</div>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                Empowering East Africa's creative economy with AI-powered, sector-adaptive credit scoring. 
                Supporting creative entrepreneurs from Nairobi to Kampala with fair, transparent, and culturally-aware financial assessments.
              </p>

              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-heva-purple/20 text-heva-purple border-heva-purple/30">
                  9 Creative Sectors
                </Badge>
                <Badge variant="outline" className="bg-heva-green/20 text-heva-green border-heva-green/30">
                  AI-Powered
                </Badge>
                <Badge variant="outline" className="bg-heva-orange/20 text-heva-orange border-heva-orange/30">
                  East Africa Focus
                </Badge>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Button
                      key={social.label}
                      variant="outline"
                      size="icon"
                      className="border-border/50 hover:bg-heva-purple/20 hover:border-heva-purple/50 hover:text-heva-purple"
                      asChild
                    >
                      <a href={social.href} aria-label={social.label}>
                        <IconComponent className="w-4 h-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Links Sections */}
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="font-semibold text-foreground">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((contact) => {
              const IconComponent = contact.icon;
              return (
                <a
                  key={contact.title}
                  href={contact.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-heva-blue/20 group-hover:bg-heva-blue/30 transition-colors">
                    <IconComponent className="w-4 h-4 text-heva-blue" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{contact.title}</div>
                    <div className="text-sm font-medium text-foreground">{contact.value}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © {currentYear} HEVA Fund LLP. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link to="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="#terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="#security" className="text-muted-foreground hover:text-foreground transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;