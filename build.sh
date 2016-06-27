NODE_ENV=production webpack -p --config webpack.production.config.js
git status
git add .
git commit -m "update build"
git fetch origin
git merge origin/master
git push origin master
git push origin release
