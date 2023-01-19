# Create folder for Loki
mkdir -p ./volumes/loki

sudo chown 10001:10001 ./volumes/loki

# Create folder for Grafana
mkdir -p ./volumes/grafana

sudo chown 472:472 ./volumes/grafana

# Create folder for Database
mkdir -p ./volumes/db-data

sudo chown -R 777 ./volumes/db-data

docker-compose up -d
