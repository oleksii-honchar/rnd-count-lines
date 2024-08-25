import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const INCLUDED_PATTERNS = ['.ts', '.js'];
const EXCLUDED_DIRS = ['node_modules', 'dist', '.history'];

// Function to check if a file matches any inclusion pattern
function matchesInclusionPatterns(filePath: string): boolean {
  return INCLUDED_PATTERNS.some(pattern => filePath.endsWith(pattern));
}

// Function to check if a directory should be excluded
function isExcludedDir(dirPath: string): boolean {
  return EXCLUDED_DIRS.some(excludedDir => dirPath.includes(excludedDir));
}

// Function to recursively find files and count lines
async function findFilesAndCountLines(startDir: string): Promise<number> {
  let totalLines = 0;

  const processDir = async (dir: string) => {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!isExcludedDir(fullPath)) {
          await processDir(fullPath);
        }
      } else if (entry.isFile()) {
        if (matchesInclusionPatterns(fullPath)) {
          console.log(fullPath)
          const lineCount = await countLinesInFile(fullPath);
          totalLines += lineCount;
        }
      }
    }
  };

  await processDir(startDir);
  return totalLines;
}

// Function to count lines in a single file
async function countLinesInFile(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    exec(`wc -l < "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(parseInt(stdout.trim(), 10));
      }
    });
  });
}

// Main function to start the process
async function main() {
  const startDir = process.argv[2];
  if (!startDir) {
    console.error('Usage: make count-lines <directory_path>');
    process.exit(1);
  }

  try {
    const totalLines = await findFilesAndCountLines(startDir);
    console.log(`Total number of lines: ${totalLines}`);
  } catch (error) {
    console.error('Error counting lines:', error);
  }
}

main();