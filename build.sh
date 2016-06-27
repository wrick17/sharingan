NODE_ENV=production webpack -p --config webpack.production.config.js
git status
git add .
git commit -m "update build"
git fetch --all
git merge origin/master
git push origin master
