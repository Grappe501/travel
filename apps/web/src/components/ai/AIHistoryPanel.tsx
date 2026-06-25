'use client';

import Link from 'next/link';
import { Badge, Card, CardContent, EmptyState } from '@/components/ui';
import type { SerializedAIHistoryItem } from '@/server/services/ai-feedback.service';

type AIHistoryPanelProps = {
  timeline: SerializedAIHistoryItem[];
  stats: {
    suggestionsResolved: number;
    interactionsLogged: number;
    acceptanceRate: number | null;
  };
};

function formatInteractionLabel(type: string) {
  switch (type) {
    case 'category':
      return 'Category suggestion';
    case 'duplicate_receipt':
      return 'Duplicate detection';
    case 'ocr':
      return 'Receipt OCR';
    default:
      return type.replace(/_/g, ' ');
  }
}

function formatOutcome(outcome: string) {
  switch (outcome) {
    case 'accepted':
      return 'Accepted';
    case 'corrected':
      return 'Corrected';
    case 'dismissed':
      return 'Dismissed';
    case 'rejected':
      return 'Rejected';
    default:
      return outcome;
  }
}

function outcomeVariant(outcome: string): 'success' | 'warning' | 'outline' | 'danger' {
  if (outcome === 'accepted') return 'success';
  if (outcome === 'corrected') return 'warning';
  if (outcome === 'rejected') return 'danger';
  return 'outline';
}

function entityLink(item: SerializedAIHistoryItem) {
  if (item.entityType === 'receipt' && item.entityId) {
    return `/receipts/${item.entityId}/review`;
  }
  return null;
}

export function AIHistoryPanel({ timeline, stats }: AIHistoryPanelProps) {
  if (timeline.length === 0) {
    return (
      <EmptyState
        title="No AI history yet"
        description="Suggestions and feedback appear here after you review receipts."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-caption text-muted">Resolved suggestions</p>
            <p className="text-section-title text-foreground">{stats.suggestionsResolved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-caption text-muted">Interactions logged</p>
            <p className="text-section-title text-foreground">{stats.interactionsLogged}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-caption text-muted">Acceptance rate</p>
            <p className="text-section-title text-foreground">
              {stats.acceptanceRate !== null
                ? `${Math.round(stats.acceptanceRate * 100)}%`
                : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      <ul className="space-y-3">
        {timeline.map((item) => {
          const href = entityLink(item);
          return (
            <li key={`${item.kind}-${item.id}`}>
              <Card>
                <CardContent className="flex flex-wrap items-start justify-between gap-3 pt-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-card-title text-foreground">
                        {formatInteractionLabel(item.interactionType)}
                      </span>
                      <Badge variant={outcomeVariant(item.outcome)}>
                        {formatOutcome(item.outcome)}
                      </Badge>
                    </div>
                    {item.message ? (
                      <p className="text-body text-muted">{item.message}</p>
                    ) : null}
                    <p className="text-caption text-muted">
                      {new Date(item.createdAt).toLocaleString()}
                      {item.confidence != null
                        ? ` · ${Math.round(item.confidence * 100)}% confidence`
                        : ''}
                    </p>
                  </div>
                  {href ? (
                    <Link href={href} className="text-body font-medium text-primary hover:underline">
                      View receipt
                    </Link>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
