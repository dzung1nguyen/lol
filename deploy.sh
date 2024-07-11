git pull origin main

yarn install

yarn build

# pm2 restart
pm2 startOrRestart ecosystem.config.js --env prod
