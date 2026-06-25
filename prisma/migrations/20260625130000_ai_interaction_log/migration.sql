-- MEC-V1-S025: AI interaction log (API-AI-003)

CREATE TYPE "AIInteractionOutcome" AS ENUM ('accepted', 'rejected', 'dismissed', 'corrected');

CREATE TABLE "ai_interaction_log" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "suggestion_id" UUID,
    "interaction_type" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" UUID,
    "stage" TEXT,
    "outcome" "AIInteractionOutcome" NOT NULL,
    "accepted" BOOLEAN,
    "confidence" DECIMAL(3,2),
    "engine_version" TEXT,
    "processing_ms" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_interaction_log_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_interaction_log_user_id_created_at_idx" ON "ai_interaction_log"("user_id", "created_at" DESC);
CREATE INDEX "ai_interaction_log_suggestion_id_idx" ON "ai_interaction_log"("suggestion_id");

ALTER TABLE "ai_interaction_log" ADD CONSTRAINT "ai_interaction_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_interaction_log" ADD CONSTRAINT "ai_interaction_log_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "ai_suggestions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE public.ai_interaction_log ENABLE ROW LEVEL SECURITY;
