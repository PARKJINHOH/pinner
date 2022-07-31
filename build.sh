(cd travelmaprecode-fe && npm run build)
rm -rf travelmaprecode-be/src/main/resources/static/*
cp -r travelmaprecode-fe/build/* travelmaprecode-be/src/main/resources/static/