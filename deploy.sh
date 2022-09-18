yarn build
rsync -rvz --delete --force dist/ deploy@flyweight.org:/var/www/flyweight.org/
