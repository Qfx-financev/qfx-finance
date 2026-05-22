const fs = require('fs');
const path = require('path');

const manifests = [
  'package.json',
  'apps/api/package.json',
  'apps/admin/package.json',
  'apps/client/package.json',
];

let hasError = false;
for (const file of manifests) {
  const p = path.resolve(process.cwd(), file);
  try {
    JSON.parse(fs.readFileSync(p, 'utf8'));
    console.log(`OK: ${file}`);
  } catch (err) {
    hasError = true;
    console.error(`INVALID: ${file}`);
    console.error(err.message);
  }
}

if (hasError) process.exit(1);
console.log('All manifests are valid JSON.');
