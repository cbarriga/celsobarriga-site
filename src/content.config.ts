/**
 * Content collection definitions.
 *
 * All collections share a `baseSchema` for common frontmatter fields.
 * Collections use Astro's glob loader to select MDX files;
 * filenames starting with `_` are excluded (drafts).
 */
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/** Shared shape of a content collection entry used across all collections. */
const baseSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()),
  author: z.string(),
  description: z.string(),
  image: z
    .object({
      src: z.string(),
      alt: z.string(),
      positionx: z.string().optional(),
      positiony: z.string().optional(),
    })
    .optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
});

const journal = defineCollection({
  loader: glob({ pattern: "**\/[^_]*.mdx", base: "./src/content/journal" }),
  schema: baseSchema,
});

export const collections = {
  journal,
};