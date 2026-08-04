"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CircleUserRound,
  Loader2,
  UserPlus,
  Plus,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  addCircleMembersApi,
  createCircleApi,
  getMyCirclesApi,
} from "@/lib/api/circles";
import { queryKeys } from "@/lib/api/query_keys";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function CirclesPage() {
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memberIds, setMemberIds] = useState("");
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.circles.myCircles(),
    queryFn: getMyCirclesApi,
  });

  const createMutation = useMutation({
    mutationFn: createCircleApi,
    onSuccess: () => {
      toast.success("Circle created");
      setCreating(false);
      setName("");
      setDescription("");
      void queryClient.invalidateQueries({
        queryKey: queryKeys.circles.lists(),
      });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Unable to create circle",
      );
    },
  });

  const addMembersMutation = useMutation({
    mutationFn: ({
      circleId,
      userIds,
    }: {
      circleId: string;
      userIds: string[];
    }) => addCircleMembersApi(circleId, { userIds }),
    onSuccess: (res) => {
      toast.success(`Added ${res.data?.count ?? 0} member(s) to the circle`);
      setAddingTo(null);
      setMemberIds("");
      void queryClient.invalidateQueries({
        queryKey: queryKeys.circles.lists(),
      });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Unable to add members");
    },
  });

  const circles = data?.data ?? [];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: { [k: string]: string } = {};
    if (!name.trim()) nextErrors.name = "Circle name is required";
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  }

  function handleAddMembers(e: React.FormEvent, circleId: string) {
    e.preventDefault();
    const userIds = memberIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    if (userIds.length === 0) return;
    addMembersMutation.mutate({ circleId, userIds });
  }

  return (
    <main className="bg-[#FAF9F6]">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-muted">
              Audience groups
            </p>
            <h1 className="mt-2 text-4xl font-black font-display md:text-2xl">
              Circles
            </h1>
          </div>

          <Button
            variant="secondary"
            onClick={() => setCreating((prev) => !prev)}
          >
            {creating ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {creating ? "Cancel" : "New circle"}
          </Button>
        </div>

        {/* ── Create circle form ─────────────── */}
        {creating && (
          <Card className="mt-8 p-6">
            <form onSubmit={handleCreate}>
              <FieldGroup className="gap-4">
                <Field data-invalid={Boolean(formErrors.name)}>
                  <FieldLabel htmlFor="circle-name">Name</FieldLabel>
                  <Input
                    id="circle-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Family, Friends, VIP"
                    aria-invalid={Boolean(formErrors.name)}
                    disabled={createMutation.isPending}
                  />
                  {formErrors.name && (
                    <FieldError errors={[{ message: formErrors.name }]} />
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="circle-description">
                    Description (optional)
                  </FieldLabel>
                  <Input
                    id="circle-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Who belongs in this circle?"
                    disabled={createMutation.isPending}
                  />
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                variant="secondary"
                className="mt-6"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create circle"}
              </Button>
            </form>
          </Card>
        )}

        {/* ── Circles list ───────────────────── */}
        <section className="grid gap-5 py-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && (
            <div className="col-span-full flex items-center justify-center gap-2 py-16 text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading your circles...
            </div>
          )}

          {isError && (
            <div className="col-span-full rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
              <p>
                {error instanceof Error
                  ? error.message
                  : "Unable to load your circles."}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !isError && circles.length === 0 && (
            <div className=" col-span-full flex justify-center">
              <Card className="lg:w-8/12  p-10 text-center">
                <UsersRound className="mx-auto h-10 w-10 " />
                <h2 className="mt-4 text-xl font-bold">No circles yet</h2>
                <p className="mt-2 mb-4 text-sm text-neutral-400">
                  Create your first circle to start grouping your audience.
                </p>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setCreating((prev) => !prev)}
                >
                  Add circle
                </Button>
              </Card>
            </div>
          )}

          {circles.map((circle) => (
            <Card key={circle.id} className="p-5">
              <div>
                <div className="flex justify-between items-center gap-2">
                 <h3 className="">{circle.name}</h3>
             
                 <p className="mt-3 inline-flex items-center gap-2 text-sm  ">
                  <UsersRound className="h-4 w-4 text-coral" />
                  {circle._count?.members ?? 0} members
                </p>
                </div>
              
                  {circle.description && (
                  <p className="mt-1 text-sm">{circle.description}</p>
                )}

                <div>
                  {addingTo === circle.id ? (
                    <form
                      className="mt-4 space-y-3"
                      onSubmit={(e) => handleAddMembers(e, circle.id)}
                    >
                      <Input
                        value={memberIds}
                        onChange={(e) => setMemberIds(e.target.value)}
                        placeholder="User IDs, comma separated"
                        disabled={addMembersMutation.isPending}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          size="sm"
                          variant="secondary"
                          disabled={addMembersMutation.isPending}
                        >
                          {addMembersMutation.isPending ? "Adding..." : "Add"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setAddingTo(null);
                            setMemberIds("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button
                      className="mt-4"
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingTo(circle.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Add member
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
