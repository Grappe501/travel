import { notFound, redirect } from 'next/navigation';
import { ClientForm, ProjectForm, ProjectList } from '@/components/clients/ClientManager';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ButtonLink, EmptyState } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as clientService from '@/server/services/client.service';
import * as projectService from '@/server/services/project.service';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function ClientDetailPage({ params }: PageProps) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;

  let client;
  try {
    client = await clientService.getClientDetail(user.id, id);
  } catch {
    notFound();
  }

  const [businesses, projects] = await Promise.all([
    businessService.listBusinesses(user.id),
    projectService.listProjects(user.id, { clientId: id }),
  ]);

  const businessId = client.businessId ?? businesses.find((b) => b.isDefault)?.id ?? businesses[0]?.id;

  return (
    <DashboardShell
      title={client.name}
      description="Client profile and projects."
      actions={
        <ButtonLink href="/clients" variant="secondary" size="sm">
          All clients
        </ButtonLink>
      }
    >
      <ClientForm businesses={businesses} initial={client} />

      <section className="space-y-4">
        <h2 className="text-section-title text-foreground">Projects</h2>
        {businessId ? (
          <ProjectForm clientId={client.id} businessId={businessId} />
        ) : (
          <EmptyState
            title="Link a business first"
            description="Assign this client to a business before adding projects."
          />
        )}
        {projects.length === 0 ? (
          <EmptyState title="No projects" description="Add a project for this client above." />
        ) : (
          <ProjectList clientId={client.id} projects={projects} />
        )}
      </section>
    </DashboardShell>
  );
}
