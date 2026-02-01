import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { EnrollmentTable } from "@/components/EnrollmentTable";
import { EnrollmentForm, EnrollmentFormData } from "@/components/EnrollmentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type Enrollment = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  program_id: string | null;
  status: string;
  notes: string | null;
  enrollment_date: string;
  created_at: string;
  programs?: { name: string } | null;
};

export type Program = {
  id: string;
  name: string;
};

export default function Admin() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
  const { toast } = useToast();

  const fetchEnrollments = async () => {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, programs(name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching enrollments:", error);
      toast({ title: "Error", description: "Failed to fetch enrollments", variant: "destructive" });
    } else {
      setEnrollments(data || []);
    }
    setLoading(false);
  };

  const fetchPrograms = async () => {
    const { data, error } = await supabase.from("programs").select("id, name");
    if (!error) setPrograms(data || []);
  };

  useEffect(() => {
    fetchEnrollments();
    fetchPrograms();
  }, []);

  const handleCreate = async (data: EnrollmentFormData) => {
    const { error } = await supabase.from("enrollments").insert([{
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      program_id: data.program_id || null,
      status: data.status,
      notes: data.notes || null,
    }]);
    if (error) {
      toast({ title: "Error", description: "Failed to create enrollment", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Enrollment created successfully" });
      setDialogOpen(false);
      fetchEnrollments();
    }
  };

  const handleUpdate = async (id: string, data: EnrollmentFormData) => {
    const { error } = await supabase.from("enrollments").update(data).eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to update enrollment", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Enrollment updated successfully" });
      setDialogOpen(false);
      setEditingEnrollment(null);
      fetchEnrollments();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("enrollments").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete enrollment", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Enrollment deleted successfully" });
      fetchEnrollments();
    }
  };

  const stats = {
    total: enrollments.length,
    pending: enrollments.filter((e) => e.status === "pending").length,
    approved: enrollments.filter((e) => e.status === "approved").length,
    completed: enrollments.filter((e) => e.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Enrollment Management</h1>
              <p className="text-muted-foreground mt-1">Manage course enrollments and track student progress</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditingEnrollment(null);
            }}>
              <DialogTrigger asChild>
                <Button className="hero-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Enrollment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="font-serif">
                    {editingEnrollment ? "Edit Enrollment" : "New Enrollment"}
                  </DialogTitle>
                </DialogHeader>
                <EnrollmentForm
                  programs={programs}
                  enrollment={editingEnrollment}
                  onSubmit={(data) => {
                    if (editingEnrollment) {
                      handleUpdate(editingEnrollment.id, data);
                    } else {
                      handleCreate(data);
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                <Clock className="w-4 h-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                <XCircle className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.completed}</div>
              </CardContent>
            </Card>
          </div>

          {/* Enrollments Table */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif">All Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <EnrollmentTable
                enrollments={enrollments}
                loading={loading}
                onEdit={(enrollment) => {
                  setEditingEnrollment(enrollment);
                  setDialogOpen(true);
                }}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
