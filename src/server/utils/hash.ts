import crypto from 'node:crypto';

export function randomSHAHash() {
  const randomValue = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(randomValue).digest('hex');
  return hash;
}

export function getCommitHash(randomIfUndefined: boolean = false) {
  const commit = // vercel enviroment
    process.env.VERCEL_GIT_COMMIT_SHA ??
    // coolify enviroment
    process.env.SOURCE_COMMIT;

  return commit || (randomIfUndefined ? randomSHAHash() : undefined);
}
