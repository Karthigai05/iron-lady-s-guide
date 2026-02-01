-- Create programs table for Iron Lady offerings
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  price DECIMAL(10,2),
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table for CRUD operations
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  notes TEXT,
  enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table for logging conversations
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for programs (anyone can see programs)
CREATE POLICY "Programs are publicly viewable" ON public.programs
  FOR SELECT USING (true);

-- Public access for enrollments (admin dashboard - will add auth later if needed)
CREATE POLICY "Anyone can view enrollments" ON public.enrollments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create enrollments" ON public.enrollments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update enrollments" ON public.enrollments
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete enrollments" ON public.enrollments
  FOR DELETE USING (true);

-- Chat messages public access for the demo
CREATE POLICY "Anyone can view chat messages" ON public.chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample programs for Iron Lady
INSERT INTO public.programs (name, description, duration, price, category) VALUES
  ('Executive Leadership Accelerator', 'Transform your leadership style with our flagship 12-week intensive program designed for ambitious women ready to break through to the C-suite.', '12 weeks', 4997.00, 'Leadership'),
  ('Confidence Catalyst Workshop', 'A powerful 3-day immersive experience focused on building unshakeable confidence and executive presence.', '3 days', 1497.00, 'Workshop'),
  ('Strategic Networking Mastery', 'Learn to build and leverage powerful professional networks that open doors and create opportunities.', '6 weeks', 2497.00, 'Networking'),
  ('Voice & Visibility Program', 'Develop your authentic voice and increase your visibility in your industry through strategic personal branding.', '8 weeks', 3497.00, 'Personal Brand'),
  ('Iron Lady Mentorship Circle', 'Join an exclusive community of high-achieving women with monthly mastermind sessions and one-on-one coaching.', 'Ongoing', 997.00, 'Mentorship');

-- Insert sample enrollments
INSERT INTO public.enrollments (full_name, email, phone, program_id, status, notes) VALUES
  ('Sarah Johnson', 'sarah.johnson@email.com', '+1 555-0101', (SELECT id FROM public.programs WHERE name = 'Executive Leadership Accelerator'), 'approved', 'VP of Marketing at Tech Corp'),
  ('Michelle Chen', 'michelle.chen@email.com', '+1 555-0102', (SELECT id FROM public.programs WHERE name = 'Confidence Catalyst Workshop'), 'pending', 'Interested in group discount'),
  ('Amanda Rodriguez', 'amanda.r@email.com', '+1 555-0103', (SELECT id FROM public.programs WHERE name = 'Strategic Networking Mastery'), 'completed', 'Excellent participant'),
  ('Jessica Williams', 'j.williams@email.com', '+1 555-0104', (SELECT id FROM public.programs WHERE name = 'Voice & Visibility Program'), 'approved', 'Referred by Sarah Johnson'),
  ('Emily Thompson', 'emily.t@email.com', '+1 555-0105', (SELECT id FROM public.programs WHERE name = 'Iron Lady Mentorship Circle'), 'pending', 'Awaiting payment confirmation');