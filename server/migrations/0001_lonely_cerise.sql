CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "posts";