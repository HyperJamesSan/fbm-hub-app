import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Lightbulb, Send, CheckCircle2 } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Tell us your name").max(120),
  area: z.string().trim().min(1, "Which area do you work in?").max(120),
  idea: z.string().trim().min(5, "A few more words please").max(2000),
  time_estimate: z.enum(["<1h", "1-3h", "3-8h", ">8h"]),
});

const timeOptions = [
  { value: "<1h", label: "Less than 1h / week" },
  { value: "1-3h", label: "1–3h / week" },
  { value: "3-8h", label: "3–8h / week" },
  { value: ">8h", label: "More than 8h / week" },
] as const;

type TimeEstimate = "<1h" | "1-3h" | "3-8h" | ">8h";

export default function Ideas() {
  const [form, setForm] = useState<{
    name: string;
    area: string;
    idea: string;
    time_estimate: TimeEstimate;
  }>({ name: "", area: "", idea: "", time_estimate: "1-3h" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Please review the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("automation_ideas").insert([{
      name: parsed.data.name,
      area: parsed.data.area,
      idea: parsed.data.idea,
      time_estimate: parsed.data.time_estimate,
    }]);
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't send your idea. Try again in a moment.");
      return;
    }
    setDone(true);
    setForm({ name: "", area: "", idea: "", time_estimate: "1-3h" });
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <div className="pt-28 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <span className="fbm-badge-primary">Ideas inbox</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter text-foreground">
              What eats your time?
            </h1>
            <p className="text-lg font-roboto text-muted-foreground mt-4 max-w-2xl">
              If something repetitive in your area could be done by AI or automation — tell us. Anyone in the team can submit. We read every one.
            </p>
          </motion.div>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fbm-card p-10 mt-10 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-montserrat font-extrabold text-foreground">Thanks — got it.</h2>
              <p className="font-roboto text-muted-foreground mt-2">
                We'll review it and get back to you if we have questions.
              </p>
              <Button onClick={() => setDone(false)} variant="outline" className="mt-6">
                Send another idea
              </Button>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="fbm-card p-6 md:p-10 mt-10 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground">
                    Your name
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={120}
                    placeholder="Jane Doe"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="area" className="text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground">
                    Area / department
                  </Label>
                  <Input
                    id="area"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    maxLength={120}
                    placeholder="Finance · Operations · IT…"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="idea" className="text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground">
                  What process or problem could AI handle?
                </Label>
                <Textarea
                  id="idea"
                  value={form.idea}
                  onChange={(e) => setForm({ ...form, idea: e.target.value })}
                  maxLength={2000}
                  rows={6}
                  placeholder="Every Monday I spend 2 hours copying data from X into Y. It's always the same fields…"
                  className="mt-2 resize-none"
                />
                <div className="text-[10px] font-mono text-muted-foreground mt-1 text-right">
                  {form.idea.length} / 2000
                </div>
              </div>

              <div>
                <Label className="text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                  How much time does it take you per week?
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, time_estimate: opt.value })}
                      className={`px-3 py-3 rounded-lg border text-xs font-montserrat font-semibold transition-all ${
                        form.time_estimate === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-montserrat font-bold"
              >
                {submitting ? "Sending…" : (
                  <>Send idea <Send className="w-4 h-4 ml-2" /></>
                )}
              </Button>

              <p className="text-[11px] font-roboto text-muted-foreground text-center">
                No login required. Your idea goes straight to the program team.
              </p>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
