import type { Client, Prisma } from '@prisma/client';
import { clientCreateSchema, clientUpdateSchema } from '@mileage-copilot/shared';
import type { ClientCreateInput, ClientUpdateInput } from '@mileage-copilot/shared';
import { NotFoundError, ValidationError } from '@/lib/api/response';
import { prisma } from '@/lib/db/prisma';
import { getOwnedBusiness } from '@/server/services/business.service';

const activeClient = { recordStatus: 'active' as const };

export function serializeClient(client: Client & { _count?: { projects: number; trips: number } }) {
  return {
    id: client.id,
    businessId: client.businessId,
    name: client.name,
    phone: client.phone,
    email: client.email,
    notes: client.notes,
    projectCount: client._count?.projects ?? 0,
    tripCount: client._count?.trips ?? 0,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  };
}

export type SerializedClient = ReturnType<typeof serializeClient>;

export async function listClients(userId: string, businessId?: string) {
  const clients = await prisma.client.findMany({
    where: {
      userId,
      ...activeClient,
      ...(businessId
        ? { OR: [{ businessId }, { businessId: null }] }
        : {}),
    },
    include: {
      _count: { select: { projects: { where: activeClient }, trips: { where: { recordStatus: 'active' } } } },
    },
    orderBy: { name: 'asc' },
  });

  return clients.map(serializeClient);
}

export async function getOwnedClient(userId: string, clientId: string) {
  const client = await prisma.client.findFirst({
    where: { id: clientId, userId, ...activeClient },
  });

  if (!client) {
    throw new NotFoundError('Client not found');
  }

  return client;
}

async function assertBusinessScope(userId: string, businessId: string | null | undefined) {
  if (!businessId) return;
  await getOwnedBusiness(userId, businessId);
}

export async function createClient(userId: string, input: ClientCreateInput) {
  const data = clientCreateSchema.parse(input);
  await assertBusinessScope(userId, data.businessId);

  const client = await prisma.client.create({
    data: {
      userId,
      name: data.name.trim(),
      businessId: data.businessId,
      phone: data.phone?.trim() || null,
      email: data.email?.trim() || null,
      notes: data.notes?.trim() || null,
    },
    include: {
      _count: { select: { projects: true, trips: true } },
    },
  });

  return serializeClient(client);
}

export async function updateClient(userId: string, clientId: string, input: ClientUpdateInput) {
  const data = clientUpdateSchema.parse(input);
  await getOwnedClient(userId, clientId);

  if (data.businessId) {
    await assertBusinessScope(userId, data.businessId);
  }

  const client = await prisma.client.update({
    where: { id: clientId },
    data: {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.businessId !== undefined ? { businessId: data.businessId } : {}),
      ...(data.phone !== undefined ? { phone: data.phone?.trim() || null } : {}),
      ...(data.email !== undefined ? { email: data.email?.trim() || null } : {}),
      ...(data.notes !== undefined ? { notes: data.notes?.trim() || null } : {}),
    },
    include: {
      _count: { select: { projects: true, trips: true } },
    },
  });

  return serializeClient(client);
}

export async function deleteClient(userId: string, clientId: string) {
  await getOwnedClient(userId, clientId);

  const linkedTrips = await prisma.trip.findMany({
    where: { clientId, userId },
    select: { id: true },
  });
  const linkedProjects = await prisma.project.findMany({
    where: { clientId, userId },
    select: { id: true },
  });

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.client.update({
      where: { id: clientId },
      data: { recordStatus: 'deleted', deletedAt: new Date() },
    });

    await tx.trip.updateMany({
      where: { clientId, userId },
      data: { clientId: null },
    });

    await tx.project.updateMany({
      where: { clientId, userId },
      data: { clientId: null },
    });

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'client',
        entityId: clientId,
        action: 'delete',
        oldValues: {
          tripIds: linkedTrips.map((item) => item.id),
          projectIds: linkedProjects.map((item) => item.id),
        },
        source: 'web',
      },
    });
  });

  return { id: clientId, deleted: true };
}

export async function getClientDetail(userId: string, clientId: string) {
  const client = await prisma.client.findFirst({
    where: { id: clientId, userId, ...activeClient },
    include: {
      _count: { select: { projects: { where: activeClient }, trips: { where: { recordStatus: 'active' } } } },
    },
  });

  if (!client) {
    throw new NotFoundError('Client not found');
  }

  return serializeClient(client);
}

export type ClientProjectSnapshot = {
  clientId: string | null;
  projectId: string | null;
  clientName: string | null;
  projectName: string | null;
};

export async function resolveClientProjectForTrip(
  userId: string,
  businessId: string,
  clientId?: string | null,
  projectId?: string | null
): Promise<ClientProjectSnapshot> {
  if (!clientId && !projectId) {
    return { clientId: null, projectId: null, clientName: null, projectName: null };
  }

  let resolvedClientId = clientId ?? null;
  let clientName: string | null = null;

  if (resolvedClientId) {
    const client = await getOwnedClient(userId, resolvedClientId);
    if (client.businessId && client.businessId !== businessId) {
      throw new ValidationError('Client does not belong to the selected business');
    }
    clientName = client.name;
  }

  let resolvedProjectId: string | null = null;
  let projectName: string | null = null;

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId, recordStatus: 'active' },
      include: { client: true },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.businessId !== businessId) {
      throw new ValidationError('Project does not belong to the selected business');
    }

    if (resolvedClientId && project.clientId && project.clientId !== resolvedClientId) {
      throw new ValidationError('Project does not belong to the selected client');
    }

    resolvedProjectId = project.id;
    projectName = project.name;

    if (!resolvedClientId && project.clientId && project.client) {
      resolvedClientId = project.clientId;
      clientName = project.client.name;
    }
  }

  return {
    clientId: resolvedClientId,
    projectId: resolvedProjectId,
    clientName,
    projectName,
  };
}
