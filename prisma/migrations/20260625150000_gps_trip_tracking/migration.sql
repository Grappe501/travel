-- STEP-070 GPS trip tracking (V1.11)

CREATE TYPE "TripGpsPointSource" AS ENUM ('live', 'start', 'end', 'sync_batch');
CREATE TYPE "TripMileageSource" AS ENUM ('odometer', 'gps', 'manual', 'hybrid');

ALTER TABLE "profiles" ADD COLUMN "app_prefs" JSONB NOT NULL DEFAULT '{}';

ALTER TABLE "trips" ADD COLUMN "tracking_enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "trips" ADD COLUMN "tracking_started_at" TIMESTAMPTZ;
ALTER TABLE "trips" ADD COLUMN "tracking_stopped_at" TIMESTAMPTZ;
ALTER TABLE "trips" ADD COLUMN "start_latitude" DECIMAL(9,6);
ALTER TABLE "trips" ADD COLUMN "start_longitude" DECIMAL(9,6);
ALTER TABLE "trips" ADD COLUMN "end_latitude" DECIMAL(9,6);
ALTER TABLE "trips" ADD COLUMN "end_longitude" DECIMAL(9,6);
ALTER TABLE "trips" ADD COLUMN "gps_miles" DECIMAL(10,1);
ALTER TABLE "trips" ADD COLUMN "mileage_source" "TripMileageSource";
ALTER TABLE "trips" ADD COLUMN "mileage_review_required" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "trip_gps_points" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "accuracy_m" DECIMAL(8,2),
    "altitude_m" DECIMAL(8,2),
    "speed_mps" DECIMAL(8,2),
    "heading" DECIMAL(6,2),
    "recorded_at" TIMESTAMPTZ NOT NULL,
    "source" "TripGpsPointSource" NOT NULL DEFAULT 'live',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_gps_points_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "trip_gps_points_trip_id_recorded_at_idx" ON "trip_gps_points"("trip_id", "recorded_at");
CREATE INDEX "trip_gps_points_user_id_recorded_at_idx" ON "trip_gps_points"("user_id", "recorded_at");

ALTER TABLE "trip_gps_points" ADD CONSTRAINT "trip_gps_points_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trip_gps_points" ADD CONSTRAINT "trip_gps_points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
