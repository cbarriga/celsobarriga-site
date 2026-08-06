#!/usr/bin/env node

/**
 * Embeds the IPTC/XMP "Data Mining" field into journal photos, marking
 * them as prohibited from data mining (including AI/ML training) per
 * the IPTC Photo Metadata 2023.1 standard. Run this after adding new
 * photos to a journal entry, before committing.
 *
 * Requires exiftool: https://exiftool.org (`brew install exiftool`)
 */

import { execFileSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const journalDir = path.join(rootDir, "src", "content", "journal");

export function tagPhotos({ exec = execFileSync, targetDir = journalDir } = {}) {
  try {
    exec("exiftool", ["-ver"], { stdio: "ignore" });
  } catch {
    console.error(
      "exiftool not found. Install it with `brew install exiftool` and try again.",
    );
    process.exitCode = 1;
    return;
  }

  const args = [
    "-XMP-plus:DataMining=Prohibited",
    "-overwrite_original",
    "-r",
    "-ext", "jpg",
    "-ext", "jpeg",
    "-ext", "png",
    targetDir,
  ];

  const output = exec("exiftool", args, { encoding: "utf8" });
  console.log(output.trim());
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  tagPhotos();
}
