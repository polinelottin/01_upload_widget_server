CREATE TABLE "uploads" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"remote_key" text NOT NULL,
	"remote_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uploads_remote_key_unique" UNIQUE("remote_key")
);
