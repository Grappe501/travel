-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('active', 'archived', 'deleted');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'suspended', 'pending_deletion', 'deleted');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('free', 'pro', 'small_business', 'enterprise');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'incomplete');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('monthly', 'annual');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('draft', 'active', 'completed', 'deleted');

-- CreateEnum
CREATE TYPE "MileageRateSource" AS ENUM ('irs', 'company', 'custom', 'vehicle', 'business');

-- CreateEnum
CREATE TYPE "ReimbursementStatus" AS ENUM ('none', 'pending', 'submitted', 'paid');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('gas', 'diesel', 'electric', 'hybrid', 'other');

-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('pending', 'processing', 'ready', 'failed');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'confirmed', 'rejected');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('mileage', 'expense', 'combined', 'client', 'vehicle');

-- CreateEnum
CREATE TYPE "ReportFormat" AS ENUM ('pdf', 'csv', 'xlsx');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('pending', 'ready', 'failed', 'expired');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('create', 'update', 'delete', 'restore');

-- CreateEnum
CREATE TYPE "AuditSource" AS ENUM ('web', 'mobile', 'api', 'system');

-- CreateEnum
CREATE TYPE "SuggestionType" AS ENUM ('duplicate_receipt', 'missing_receipt', 'category', 'trip_association', 'anomaly');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('pending', 'accepted', 'rejected', 'dismissed');

-- CreateEnum
CREATE TYPE "BusinessMemberRole" AS ENUM ('owner', 'admin', 'employee');

-- CreateEnum
CREATE TYPE "BusinessMemberStatus" AS ENUM ('pending', 'active', 'suspended', 'removed');

-- CreateEnum
CREATE TYPE "FileAssetKind" AS ENUM ('receipt', 'receipt_thumbnail', 'export', 'logo', 'avatar');

-- CreateEnum
CREATE TYPE "MileageRateType" AS ENUM ('irs', 'company', 'custom');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "language" CHAR(5) NOT NULL DEFAULT 'en-US',
    "country" CHAR(2),
    "avatar_url" TEXT,
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "tax_year" INTEGER NOT NULL DEFAULT 2026,
    "mileage_rate_type" "MileageRateType" NOT NULL DEFAULT 'irs',
    "custom_mileage_rate" DECIMAL(6,4),
    "account_status" "AccountStatus" NOT NULL DEFAULT 'active',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'free',
    "billing_cycle" "BillingCycle",
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "trial_ends_at" TIMESTAMP(3),
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "feature_flags" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_counters" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "period_month" DATE NOT NULL,
    "trips_count" INTEGER NOT NULL DEFAULT 0,
    "receipts_count" INTEGER NOT NULL DEFAULT 0,
    "ocr_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "logo_storage_path" TEXT,
    "tax_id" TEXT,
    "address" JSONB,
    "phone" TEXT,
    "website" TEXT,
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "default_mileage_rate" DECIMAL(6,4),
    "timezone" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "record_status" "RecordStatus" NOT NULL DEFAULT 'active',
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_members" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "user_id" UUID,
    "invite_email" TEXT,
    "role" "BusinessMemberRole" NOT NULL DEFAULT 'employee',
    "status" "BusinessMemberStatus" NOT NULL DEFAULT 'pending',
    "can_approve_reimbursement" BOOLEAN NOT NULL DEFAULT false,
    "joined_at" TIMESTAMP(3),
    "record_status" "RecordStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "business_id" UUID,
    "nickname" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "vin" TEXT,
    "license_plate" TEXT,
    "fuel_type" "FuelType",
    "current_odometer" DECIMAL(10,1),
    "default_mileage_rate" DECIMAL(6,4),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "record_status" "RecordStatus" NOT NULL DEFAULT 'active',
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mileage_rates" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "business_id" UUID,
    "name" TEXT NOT NULL,
    "rate" DECIMAL(6,4) NOT NULL,
    "source" "MileageRateSource" NOT NULL,
    "effective_from" DATE NOT NULL,
    "effective_to" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mileage_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "client_name" TEXT,
    "project_name" TEXT,
    "status" "TripStatus" NOT NULL DEFAULT 'draft',
    "purpose" TEXT NOT NULL,
    "destination" TEXT,
    "start_location" TEXT,
    "end_location" TEXT,
    "start_odometer" DECIMAL(10,1),
    "end_odometer" DECIMAL(10,1),
    "miles" DECIMAL(10,1),
    "mileage_rate" DECIMAL(6,4),
    "mileage_rate_source" "MileageRateSource",
    "reimbursement_amount" DECIMAL(10,2),
    "expense_total" DECIMAL(10,2),
    "grand_total" DECIMAL(10,2),
    "notes" TEXT,
    "reimbursement_status" "ReimbursementStatus" NOT NULL DEFAULT 'none',
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "record_status" "RecordStatus" NOT NULL DEFAULT 'active',
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "business_id" UUID,
    "trip_id" UUID,
    "storage_path" TEXT NOT NULL,
    "thumbnail_path" TEXT,
    "file_hash" TEXT,
    "file_size_bytes" INTEGER,
    "mime_type" TEXT,
    "merchant" TEXT,
    "receipt_date" DATE,
    "subtotal" DECIMAL(10,2),
    "tax" DECIMAL(10,2),
    "total" DECIMAL(10,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "ocr_confidence" DECIMAL(3,2),
    "upload_status" "UploadStatus" NOT NULL DEFAULT 'pending',
    "review_status" "ReviewStatus" NOT NULL DEFAULT 'pending',
    "idempotency_key" UUID,
    "record_status" "RecordStatus" NOT NULL DEFAULT 'active',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "trip_id" UUID,
    "receipt_id" UUID,
    "category_slug" TEXT NOT NULL DEFAULT 'other',
    "merchant" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "tax_amount" DECIMAL(10,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "expense_date" DATE NOT NULL,
    "payment_method" TEXT,
    "notes" TEXT,
    "record_status" "RecordStatus" NOT NULL DEFAULT 'active',
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "business_id" UUID,
    "report_type" "ReportType" NOT NULL,
    "date_range_start" DATE NOT NULL,
    "date_range_end" DATE NOT NULL,
    "format" "ReportFormat" NOT NULL,
    "filters" JSONB,
    "storage_path" TEXT,
    "file_hash" TEXT,
    "file_size_bytes" INTEGER,
    "status" "ReportStatus" NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "generated_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" "AuditAction" NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "source" "AuditSource" NOT NULL DEFAULT 'web',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_events" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "business_id" UUID,
    "event_type" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" UUID,
    "payload" JSONB,
    "correlation_id" UUID,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocr_results" (
    "id" UUID NOT NULL,
    "receipt_id" UUID NOT NULL,
    "raw_response" JSONB,
    "merchant" TEXT,
    "receipt_date" DATE,
    "subtotal" DECIMAL(10,2),
    "tax" DECIMAL(10,2),
    "total" DECIMAL(10,2),
    "suggested_category_slug" TEXT,
    "confidence_scores" JSONB,
    "processing_engine" TEXT,
    "model_version" TEXT,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "ocr_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_suggestions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "suggestion_type" "SuggestionType" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID NOT NULL,
    "suggested_value" JSONB,
    "message" TEXT,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "ai_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_assets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "kind" "FileAssetKind" NOT NULL,
    "storage_path" TEXT NOT NULL,
    "mime_type" TEXT,
    "file_size_bytes" INTEGER,
    "file_hash" TEXT,
    "entity_type" TEXT,
    "entity_id" UUID,
    "receipt_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profiles_email_idx" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "usage_counters_user_id_period_month_key" ON "usage_counters"("user_id", "period_month");

-- CreateIndex
CREATE INDEX "businesses_user_id_idx" ON "businesses"("user_id");

-- CreateIndex
CREATE INDEX "business_members_business_id_idx" ON "business_members"("business_id");

-- CreateIndex
CREATE INDEX "vehicles_user_id_idx" ON "vehicles"("user_id");

-- CreateIndex
CREATE INDEX "trips_user_id_status_idx" ON "trips"("user_id", "status");

-- CreateIndex
CREATE INDEX "trips_business_id_started_at_idx" ON "trips"("business_id", "started_at" DESC);

-- CreateIndex
CREATE INDEX "receipts_user_id_file_hash_idx" ON "receipts"("user_id", "file_hash");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_user_id_idempotency_key_key" ON "receipts"("user_id", "idempotency_key");

-- CreateIndex
CREATE INDEX "expenses_trip_id_idx" ON "expenses"("trip_id");

-- CreateIndex
CREATE INDEX "expenses_user_id_expense_date_idx" ON "expenses"("user_id", "expense_date" DESC);

-- CreateIndex
CREATE INDEX "reports_user_id_generated_at_idx" ON "reports"("user_id", "generated_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "business_events_user_id_occurred_at_idx" ON "business_events"("user_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "business_events_entity_type_entity_id_idx" ON "business_events"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "ocr_results_receipt_id_key" ON "ocr_results"("receipt_id");

-- CreateIndex
CREATE INDEX "ai_suggestions_user_id_status_idx" ON "ai_suggestions"("user_id", "status");

-- CreateIndex
CREATE INDEX "file_assets_user_id_kind_idx" ON "file_assets"("user_id", "kind");

-- CreateIndex
CREATE INDEX "file_assets_entity_type_entity_id_idx" ON "file_assets"("entity_type", "entity_id");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_counters" ADD CONSTRAINT "usage_counters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_members" ADD CONSTRAINT "business_members_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_members" ADD CONSTRAINT "business_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mileage_rates" ADD CONSTRAINT "mileage_rates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mileage_rates" ADD CONSTRAINT "mileage_rates_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_events" ADD CONSTRAINT "business_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_events" ADD CONSTRAINT "business_events_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocr_results" ADD CONSTRAINT "ocr_results_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_suggestions" ADD CONSTRAINT "ai_suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_assets" ADD CONSTRAINT "file_assets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_assets" ADD CONSTRAINT "file_assets_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
