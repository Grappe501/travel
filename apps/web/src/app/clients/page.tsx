import { redirect } from 'next/navigation';
import { ClientForm, ClientList } from '@/components/clients/ClientManager';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { EmptyState } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as clientService from '@/server/services/client.service';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const [clients, businesses] = await Promise.all([
    clientService.listClients(user.id),
    businessService.listBusinesses(user.id),
  ]);

  return (
    <DashboardShell
      title="Clients"
      description="Manage clients and projects for trip tagging and client reports."
    >
      <ClientForm businesses={businesses} />
      {clients.length === 0 ? (
        <EmptyState
          title="No clients yet"
          description="Add your first client using the form above."
        />
      ) : (
        <ClientList clients={clients} />
      )}
    </DashboardShell>
  );
}
