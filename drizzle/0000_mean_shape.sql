CREATE TABLE "BingoCard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Prediction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bingoCardId" uuid NOT NULL,
	"description" text NOT NULL,
	"position" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"loginToken" text,
	"loginTokenExpiresAt" timestamp,
	"isAdmin" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "BingoCard" ADD CONSTRAINT "BingoCard_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_bingoCardId_BingoCard_id_fk" FOREIGN KEY ("bingoCardId") REFERENCES "public"."BingoCard"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "BingoCard_userId_key" ON "BingoCard" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "Prediction_bingoCardId_position_key" ON "Prediction" USING btree ("bingoCardId","position");--> statement-breakpoint
CREATE UNIQUE INDEX "User_email_key" ON "User" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "User_loginToken_key" ON "User" USING btree ("loginToken");