import { useEffect, useState } from "react";
import { Clock, DollarSign, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Program = {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  price: number | null;
  category: string | null;
};

export function ProgramsSection() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching programs:", error);
      } else {
        setPrograms(data || []);
      }
      setLoading(false);
    }
    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <section id="programs" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="programs" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Programs</Badge>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Transform Your Leadership
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the program that aligns with your goals and begin your transformation today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <Card
              key={program.id}
              className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-elevated animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />
              <CardHeader>
                {program.category && (
                  <Badge variant="secondary" className="w-fit mb-2">
                    {program.category}
                  </Badge>
                )}
                <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                  {program.name}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {program.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  {program.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{program.duration}</span>
                    </div>
                  )}
                  {program.price && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${program.price.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <Button className="w-full hero-gradient group/btn">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
