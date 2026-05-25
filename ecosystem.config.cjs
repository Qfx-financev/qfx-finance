module.exports = { apps: [ { name: 'qfx-api', cwd: 
      '/var/www/qfx-finance/apps/api', script: 'npm', args: 
      'run start:dev', env: {
        NODE_ENV: 'production'
      }
    },
    { name: 'qfx-client', cwd: 
      '/var/www/qfx-finance/apps/client', script: 'npm', 
      args: 'run start', env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
