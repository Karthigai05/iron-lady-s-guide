import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Iron Lady program information for context
const IRON_LADY_CONTEXT = `
You are the AI assistant for Iron Lady (www.iamironlady.com), a premier women's empowerment and leadership development organization.

ABOUT IRON LADY:
Iron Lady empowers ambitious women to break through barriers and achieve their full potential in leadership and life. We offer transformative programs designed for women who are ready to step into their power and lead with confidence.

OUR PROGRAMS:
1. Executive Leadership Accelerator (12 weeks, $4,997) - Our flagship program for women ready to break through to the C-suite. Covers strategic leadership, executive presence, negotiation mastery, and board readiness.

2. Confidence Catalyst Workshop (3 days, $1,497) - An immersive experience focused on building unshakeable confidence and executive presence. Perfect for women preparing for major career transitions.

3. Strategic Networking Mastery (6 weeks, $2,497) - Learn to build and leverage powerful professional networks. Includes LinkedIn optimization, event strategy, and relationship cultivation.

4. Voice & Visibility Program (8 weeks, $3,497) - Develop your authentic voice and increase visibility through strategic personal branding, thought leadership, and media presence.

5. Iron Lady Mentorship Circle (Ongoing, $997/month) - Join an exclusive community with monthly mastermind sessions and one-on-one coaching from successful women leaders.

ENROLLMENT PROCESS:
1. Schedule a discovery call to discuss your goals
2. Choose the program that aligns with your ambitions
3. Complete enrollment and onboarding
4. Begin your transformation journey

VALUES:
- Authenticity over perfection
- Collaboration over competition
- Action over hesitation
- Growth mindset
- Supporting women lifting other women

Be warm, professional, and empowering in your responses. Help potential clients understand which program might be right for them based on their goals and current situation. Always encourage them to take the next step in their leadership journey.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: IRON_LADY_CONTEXT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
