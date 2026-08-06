import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { tagPhotos } from "../../scripts/tag-photos.js";

describe("tagPhotos", () => {
  const targetDir = "/fake/journal";
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    process.exitCode = undefined;
  });

  afterEach(() => {
    errorSpy.mockRestore();
    logSpy.mockRestore();
    process.exitCode = undefined;
  });

  it("tags jpg/jpeg/png under the target dir with the Prohibited data-mining flag", () => {
    const exec = vi
      .fn()
      .mockReturnValueOnce(undefined) // -ver check
      .mockReturnValueOnce("5 image files updated"); // tagging run

    tagPhotos({ exec, targetDir });

    expect(exec).toHaveBeenNthCalledWith(1, "exiftool", ["-ver"], {
      stdio: "ignore",
    });
    expect(exec).toHaveBeenNthCalledWith(
      2,
      "exiftool",
      [
        "-XMP-plus:DataMining=Prohibited",
        "-overwrite_original",
        "-r",
        "-ext",
        "jpg",
        "-ext",
        "jpeg",
        "-ext",
        "png",
        targetDir,
      ],
      { encoding: "utf8" },
    );
    expect(logSpy).toHaveBeenCalledWith("5 image files updated");
  });

  it("fails gracefully with a helpful message when exiftool isn't installed", () => {
    const exec = vi.fn().mockImplementation(() => {
      throw new Error("command not found: exiftool");
    });

    tagPhotos({ exec, targetDir });

    expect(exec).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("exiftool not found"),
    );
    expect(process.exitCode).toBe(1);
  });
});
