import type { Prisma, Project } from '@prisma/client';
import { projectCreateSchema, projectUpdateSchema } from '@mileage-copilot/shared';
import type { ProjectCreateInput, ProjectUpdateInput } from '@mileage-copilot/shared';
import { NotFoundError, ValidationError } from '@/lib/api/response';
import { prisma } from '@/lib/db/prisma';
import { getOwnedBusiness } from '@/server/services/business.service';
import { getOwnedClient } from '@/server/services/client.service';

const activeProject = { recordStatus: 'active' as const };

export function serializeProject(project: Project & { _count?: { trips: number } }) {
  return {
    id: project.id,
    businessId: project.businessId,
    clientId: project.clientId,
    name: project.name,
    status: project.status,
    budget: project.budget ? Number(project.budget) : null,
    notes: project.notes,
    tripCount: project._count?.trips ?? 0,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export type SerializedProject = ReturnType<typeof serializeProject>;

export async function listProjects(
  userId: string,
  filters: { businessId?: string; clientId?: string } = {}
) {
  const projects = await prisma.project.findMany({
    where: {
      userId,
      ...activeProject,
      ...(filters.businessId ? { businessId: filters.businessId } : {}),
      ...(filters.clientId ? { clientId: filters.clientId } : {}),
    },
    include: {
      _count: { select: { trips: { where: { recordStatus: 'active' } } } },
    },
    orderBy: [{ status: 'asc' }, { name: 'asc' }],
  });

  return projects.map(serializeProject);
}

export async function getOwnedProject(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId, ...activeProject },
  });

  if (!project) {
    throw new NotFoundError('Project not found');
  }

  return project;
}

export async function createProject(userId: string, input: ProjectCreateInput) {
  const data = projectCreateSchema.parse(input);
  await getOwnedBusiness(userId, data.businessId);

  if (data.clientId) {
    const client = await getOwnedClient(userId, data.clientId);
    if (client.businessId && client.businessId !== data.businessId) {
      throw new ValidationError('Client does not belong to the selected business');
    }
  }

  const project = await prisma.project.create({
    data: {
      userId,
      businessId: data.businessId,
      clientId: data.clientId,
      name: data.name.trim(),
      status: data.status ?? 'active',
      budget: data.budget,
      notes: data.notes?.trim() || null,
    },
    include: {
      _count: { select: { trips: true } },
    },
  });

  return serializeProject(project);
}

export async function updateProject(userId: string, projectId: string, input: ProjectUpdateInput) {
  const data = projectUpdateSchema.parse(input);
  const existing = await getOwnedProject(userId, projectId);

  if (data.clientId) {
    const client = await getOwnedClient(userId, data.clientId);
    if (client.businessId && client.businessId !== existing.businessId) {
      throw new ValidationError('Client does not belong to this project business');
    }
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.clientId !== undefined ? { clientId: data.clientId } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.budget !== undefined ? { budget: data.budget } : {}),
      ...(data.notes !== undefined ? { notes: data.notes?.trim() || null } : {}),
    },
    include: {
      _count: { select: { trips: true } },
    },
  });

  return serializeProject(project);
}

export async function deleteProject(userId: string, projectId: string) {
  await getOwnedProject(userId, projectId);

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.project.update({
      where: { id: projectId },
      data: { recordStatus: 'deleted', deletedAt: new Date() },
    });

    await tx.trip.updateMany({
      where: { projectId, userId },
      data: { projectId: null },
    });
  });

  return { ok: true };
}

export async function getProjectDetail(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId, ...activeProject },
    include: {
      _count: { select: { trips: { where: { recordStatus: 'active' } } } },
    },
  });

  if (!project) {
    throw new NotFoundError('Project not found');
  }

  return serializeProject(project);
}
