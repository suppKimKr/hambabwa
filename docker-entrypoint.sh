#echo "wait db server"
#bash -c | /app/wait-for-it.sh db:3306 -t 10

echo "start hambabwa server"
npm run start:${NPM_MODE}