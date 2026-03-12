module.exports = {
  apps: [
    {
      name: 'ml-backend',
      script: './backend/server.js',
      cwd: '/home/ubuntu/ml-platform-frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/home/ubuntu/logs/ml-backend-error.log',
      out_file: '/home/ubuntu/logs/ml-backend-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
