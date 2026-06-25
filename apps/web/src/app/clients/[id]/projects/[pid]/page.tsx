import { notFound, redirect } from 'next/navigation';
import { ProjectForm } from '@/components/clients/ClientManager';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge, ButtonLink, Card, CardContent } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as clientService from '@/server/services/client.service';
import * as projectService from '@/server/services/project.service';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string; pid: string }> };

export default async function ProjectDetailPage({ params }: PageProps) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { id: clientId, pid } = await params;

  let client;
  let project;
  try {
    [client, project] = await Promise.all([
      clientService.getClientDetail(user.id, clientId),
      projectService.getProjectDetail(user.id, pid),
    ]);
  } catch {
    notFound();
  }

  if (project.clientId && project.clientId !== clientId) {
    notFound();
  }

  return (
    <DashboardShell
      title={project.name}
      description={`Project for ${client.name}`}
      badge={<Badge variant="outline">{project.status}</Badge>}
      actions={
        <ButtonLink href={`/clients/${clientId}`} variant="secondary" size="sm">
          Back to client
        </ButtonLink>
      }
    >
      <Card>
        <CardContent className="space-y-2 pt-4 text-body text-muted">
          <p>
            <span className="text-foreground">Trips:</span> {project.tripCount}
          </p>
          {project.budget !== null ? (
            <p>
              <span className="text-foreground">Budget:</span> ${project.budget.toFixed(2)}
            </p>
          ) : null}
          {project.notes ? (
            <p>
              <span className="text-foreground">Notes:</span> {project.notes}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <ProjectForm
        clientId={clientId}
        businessId={project.businessId}
        initial={project}
      />
    </DashboardShell>
  );
}
