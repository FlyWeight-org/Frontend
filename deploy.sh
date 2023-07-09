yarn build
rsync -rvz --delete --force dist/ deploy@flyweight.org:/var/www/flyweight.org/
bugsnag-cli create-build --api-key=0cee38f2f35ce8e13679ca3b6864af56 --version-name="$(git rev-parse HEAD)" --release-stage=production
