openapi-generator-cli generate -i collaborative-translate-api.yaml --generator-name typescript-fetch -o ../frontend/src/gen


inotifywait -q -m -e close_write collaborative-translate-api.yaml |
while read -r filename event; do
    openapi-generator-cli generate -i collaborative-translate-api.yaml --generator-name typescript-fetch -o ../frontend/src/gen
done