const { createRequire } = require('node:module')
const path = require('node:path')

const workspaces = ['apps/admin', 'apps/client']
let hasError = false

for (const workspace of workspaces) {
  const workspacePkg = path.resolve(process.cwd(), workspace, 'package.json')
  const req = createRequire(workspacePkg)

  try {
    req.resolve('@types/react/package.json')
    console.log(`OK: ${workspace} can resolve @types/react`)
  } catch (error) {
    hasError = true
    console.error(`ERROR: ${workspace} cannot resolve @types/react`)
    console.error(
      `Fix: run \"npm install --workspace ${workspace}\" (or \"npm install --workspaces\") in an environment with registry access.`
    )
  }
}

if (hasError) {
  process.exit(1)
}
