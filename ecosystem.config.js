// https://dykraf.com/blog/deploying-nextjs-web-application-with-pm2
module.exports = {
  apps: [
    {
      name: "project",
      exec_mode: "cluster",
      instances: "max", // Or a number of instances
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      env_prod: {
        APP_ENV: "prod", // APP_ENV=prod
      },
    },
  ],
};
