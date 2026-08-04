"use client";

import { Loader2, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useSendEventEmail } from "@/app/_queries/email";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function EmailBroadcastComposer({ eventId }: { eventId: string }) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const mutation = useSendEventEmail();
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  async function handleSend() {
    const nextErrors: { [k: string]: string } = {};
    if (!subject.trim()) nextErrors.subject = "Subject is required";
    if (!content.trim()) nextErrors.content = "Message is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const res = await mutation.mutateAsync({ eventId, subject, content });
      toast.success(
        res.data
          ? `Email sent to ${res.data.sent} of ${res.data.totalRecipients} guests`
          : "Email queued",
      );
      setSubject("");
      setContent("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send email",
      );
    }
  }

  return (
    <Card className="px-6 py-6">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-turquoise" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Email your guests
        </h3>
      </div>

      <FieldGroup className="mt-4 gap-4">
        <Field data-invalid={Boolean(errors.subject)}>
          <FieldLabel htmlFor="broadcast-subject">Subject</FieldLabel>
          <Input
            id="broadcast-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Event updates"
            aria-invalid={Boolean(errors.subject)}
          />
          {errors.subject && <FieldError errors={[{ message: errors.subject }]} />}
        </Field>
        <Field data-invalid={Boolean(errors.content)}>
          <FieldLabel htmlFor="broadcast-content">Message</FieldLabel>
          <Textarea
            id="broadcast-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your message to guests…"
            rows={5}
            aria-invalid={Boolean(errors.content)}
          />
          {errors.content && <FieldError errors={[{ message: errors.content }]} />}
        </Field>
      </FieldGroup>

      <Button
        onClick={handleSend}
        disabled={mutation.isPending}
        className="mt-5"
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Send to all guests
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        Sends to all guests with a valid email. Your wallet may be charged for
        emails beyond the free allowance.
      </p>
    </Card>
  );
}
