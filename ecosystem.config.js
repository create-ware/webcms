module.exports = {
  apps: [{
    name: 'WEBCMS',
    script: './server-app/server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      'NODE_ENV': 'development',
    },
    env_production: {
      'NODE_ENV': 'production',
    },
    ignore_watch: [
      'node_modules',
      'dashboard-app',
      'storage',
      'server-app/view',
      'database',
      'docker',
      'proxy',
      'server-app/migrations',
      '.git'
    ]
  }]
}
