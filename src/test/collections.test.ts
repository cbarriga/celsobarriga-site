import { describe, it, expect } from "vitest";
import { buildDetailPaths, buildTagPaths } from "../scripts/collections";

const makeEntry = (id: string, tags: string[]) => ({
  id,
  body: "",
  data: {
    title: "Test",
    description: "Desc",
    tags,
    pubDate: new Date("2025-01-01"),
    author: "Author",
  },
});

describe("buildDetailPaths", () => {
  it("maps entries to { params: { id }, props: { entry } }", () => {
    const entries = [makeEntry("post-1", []), makeEntry("post-2", [])];
    const paths = buildDetailPaths(entries);
    expect(paths).toHaveLength(2);
    expect(paths[0]).toEqual({ params: { id: "post-1" }, props: { entry: entries[0] } });
    expect(paths[1]).toEqual({ params: { id: "post-2" }, props: { entry: entries[1] } });
  });

  it("returns an empty array for no entries", () => {
    expect(buildDetailPaths([])).toEqual([]);
  });
});

describe("buildTagPaths", () => {
  it("returns one path per unique tag", () => {
    const entries = [
      makeEntry("a", ["astro", "react"]),
      makeEntry("b", ["astro"]),
      makeEntry("c", ["typescript"]),
    ];
    const paths = buildTagPaths(entries, "journal");
    const tags = paths.map((p) => p.params.tag).sort();
    expect(tags).toEqual(["astro", "react", "typescript"]);
  });

  it("includes only posts that have the tag", () => {
    const entries = [
      makeEntry("a", ["astro"]),
      makeEntry("b", ["react"]),
    ];
    const paths = buildTagPaths(entries, "journal");
    const astroPath = paths.find((p) => p.params.tag === "astro")!;
    expect(astroPath.props.posts).toHaveLength(1);
    expect(astroPath.props.posts[0].id).toBe("a");
  });

  it("passes collectionSlug through to props", () => {
    const entries = [makeEntry("a", ["tag"])];
    const paths = buildTagPaths(entries, "journal");
    expect(paths[0].props.collectionSlug).toBe("journal");
  });

  it("returns empty array for entries with no tags", () => {
    const entries = [makeEntry("a", [])];
    expect(buildTagPaths(entries, "journal")).toEqual([]);
  });
});
