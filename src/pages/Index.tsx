import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("actor_submissions").insert({
      full_name: name,
      email: "test@test.com",
      phone: "0500000000",
      normalized_email: "test@test.com",
      normalized_phone: "0500000000",
      gender: "זכר",
      birth_year: 1990,
      vat_status: "עוסק פטור",
      languages: ["עברית"],
      match_status: "pending",
      review_status: "pending",
      raw_payload: { test: true },
    });

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Row inserted!" });
      setName("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default Index;
