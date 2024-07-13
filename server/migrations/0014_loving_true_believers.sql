ALTER TABLE "productVariant" RENAME TO "productVariants";--> statement-breakpoint
ALTER TABLE "productVariants" DROP CONSTRAINT "productVariant_productID_products_id_fk";
--> statement-breakpoint
ALTER TABLE "variantImages" DROP CONSTRAINT "variantImages_variantID_productVariant_id_fk";
--> statement-breakpoint
ALTER TABLE "variantTags" DROP CONSTRAINT "variantTags_variantID_productVariant_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariants" ADD CONSTRAINT "productVariants_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantImages" ADD CONSTRAINT "variantImages_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantTags" ADD CONSTRAINT "variantTags_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
