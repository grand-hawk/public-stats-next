import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const folderPath = process.argv[2];
const commandToRun = process.argv.slice(3).join(' ');

if (!folderPath || !commandToRun) process.exit(1);

if (!existsSync(folderPath))
  try {
    execSync(commandToRun, { stdio: 'inherit' });
  } catch (error) {
    process.exit(error.status || 1);
  }
