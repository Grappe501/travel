'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Badge, Button, Card, CardContent, Input, RemoveEntryButton, Select } from '@/components/ui';
import type { SerializedBusiness, SerializedClient, SerializedProject } from '@/lib/types/core';

type ClientFormProps = {
  businesses: SerializedBusiness[];
  initial?: SerializedClient;
  onSuccess?: () => void;
};

export function ClientForm({ businesses, initial, onSuccess }: ClientFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [businessId, setBusinessId] = useState(initial?.businessId ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      ...(businessId ? { businessId } : {}),
      ...(phone ? { phone } : {}),
      ...(email ? { email } : {}),
      ...(notes ? { notes } : {}),
    };

    const response = await fetch(initial ? `/api/clients/${initial.id}` : '/api/clients', {
      method: initial ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not save client');
      setLoading(false);
      return;
    }

    onSuccess?.();
    router.refresh();
    if (!initial) {
      setName('');
      setPhone('');
      setEmail('');
      setNotes('');
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}

          <Input
            label="Client name"
            id="client-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={200}
          />

          <Select
            label="Business (optional)"
            id="client-business"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            options={[
              { value: '', label: 'All businesses' },
              ...businesses.map((b) => ({ value: b.id, label: b.name })),
            ]}
          />

          <Input
            label="Phone (optional)"
            id="client-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={50}
          />

          <Input
            label="Email (optional)"
            id="client-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={200}
          />

          <Input
            label="Notes (optional)"
            id="client-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={2000}
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : initial ? 'Update client' : 'Add client'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type ClientListProps = {
  clients: SerializedClient[];
};

export function ClientList({ clients }: ClientListProps) {
  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <Card key={client.id}>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="space-y-1">
              <Link href={`/clients/${client.id}`} className="text-card-title text-foreground hover:underline">
                {client.name}
              </Link>
              <p className="text-caption text-muted">
                {client.projectCount} project{client.projectCount === 1 ? '' : 's'} ·{' '}
                {client.tripCount} trip{client.tripCount === 1 ? '' : 's'}
              </p>
            </div>
            <RemoveEntryButton
              apiUrl={`/api/clients/${client.id}`}
              entityType="client"
              entityLabel="Client"
              title="Delete this client?"
              description="Linked trips keep the client name snapshot. You can undo for a few seconds."
              label="Delete"
              confirmLabel="Delete"
              variant="destructive"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type ProjectFormProps = {
  clientId: string;
  businessId: string;
  initial?: SerializedProject;
  onSuccess?: () => void;
};

export function ProjectForm({ clientId, businessId, initial, onSuccess }: ProjectFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [status, setStatus] = useState(initial?.status ?? 'active');
  const [budget, setBudget] = useState(initial?.budget?.toString() ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      businessId,
      clientId,
      status,
      ...(budget ? { budget: Number(budget) } : {}),
      ...(notes ? { notes } : {}),
    };

    const response = await fetch(initial ? `/api/projects/${initial.id}` : '/api/projects', {
      method: initial ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not save project');
      setLoading(false);
      return;
    }

    onSuccess?.();
    router.refresh();
    if (!initial) {
      setName('');
      setBudget('');
      setNotes('');
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}

          <Input
            label="Project name"
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={200}
          />

          <Select
            label="Status"
            id="project-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'archived', label: 'Archived' },
            ]}
          />

          <Input
            label="Budget (optional)"
            id="project-budget"
            type="number"
            step="0.01"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <Input
            label="Notes (optional)"
            id="project-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={2000}
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : initial ? 'Update project' : 'Add project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type ProjectListProps = {
  clientId: string;
  projects: SerializedProject[];
};

export function ProjectList({ clientId, projects }: ProjectListProps) {
  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="space-y-1">
              <Link
                href={`/clients/${clientId}/projects/${project.id}`}
                className="text-card-title text-foreground hover:underline"
              >
                {project.name}
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{project.status}</Badge>
                <span className="text-caption text-muted">
                  {project.tripCount} trip{project.tripCount === 1 ? '' : 's'}
                </span>
              </div>
            </div>
            <RemoveEntryButton
              apiUrl={`/api/projects/${project.id}`}
              entityType="project"
              entityLabel="Project"
              title="Delete this project?"
              description="Trips linked to this project will be unlinked. You can undo for a few seconds."
              label="Delete"
              confirmLabel="Delete"
              variant="destructive"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
