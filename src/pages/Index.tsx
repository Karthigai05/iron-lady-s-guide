import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProgramsSection } from "@/components/ProgramsSection";
import { ChatBot } from "@/components/ChatBot";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProgramsSection />

      {/* Testimonial Section */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center mx-auto mb-8">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <blockquote className="font-serif text-2xl md:text-3xl text-foreground italic mb-6">
              "Iron Lady didn't just transform my career—it transformed how I see myself as a leader. 
              I went from second-guessing every decision to leading with confidence and conviction."
            </blockquote>
            <div>
              <div className="font-semibold text-foreground">Sarah Mitchell</div>
              <div className="text-sm text-muted-foreground">CEO, Tech Innovators Inc.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Lead?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Take the first step towards becoming the leader you were meant to be. 
              Schedule a free discovery call today.
            </p>
            <button className="bg-primary-foreground text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors">
              Book Your Free Call
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-foreground text-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Iron Lady</h3>
              <p className="text-background/70 text-sm">
                Empowering women to break through barriers and lead with confidence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Programs</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>Executive Leadership</li>
                <li>Confidence Catalyst</li>
                <li>Strategic Networking</li>
                <li>Voice & Visibility</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>About Us</li>
                <li>Success Stories</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-background/70">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> hello@iamironlady.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> +1 (555) 000-0000
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> New York, NY
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/10 mt-12 pt-8 text-center text-sm text-background/50">
            © 2026 Iron Lady. All rights reserved.
          </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

export default Index;
