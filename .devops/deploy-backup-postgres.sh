#!/bin/bash

source "./.env"

tput setaf 3; echo "REMOTE_SERV_USER = ${REMOTE_SERV_USER}"
echo "REMOTE_DB_LINK = ${REMOTE_DB_LINK}"

# local variables
DB_NAME=$(echo $REMOTE_DB_LINK | grep -o  '[a-zA-Z_]\+$')
DUMPS_DIR="./dumps/dumps_${DB_NAME}"
DUMPS_PATH=$(ssh $REMOTE_SERV_USER -f "ls ${DUMPS_DIR}/*.sql -A1 | sort | tail -1") # or "${DUMPS_DIR}/${DB_NAME}_2022-02-06.sql"
POSTGRES_RUN_COM="docker exec -i dev_postgres /bin/bash -c"

tput setaf 2; echo "Copy dump file... | dbName = ${DB_NAME}"
mkdir -p $DUMPS_DIR
scp $REMOTE_SERV_USER:$DUMPS_PATH $DUMPS_PATH

docker-compose up -d

echo "Drop DB. Create DB and grant all roles..."
$POSTGRES_RUN_COM "PGPASSWORD=root psql -U root postgres" <<-EOSQL
  REVOKE CONNECT ON DATABASE ${DB_NAME} FROM PUBLIC, ${DB_NAME};
  REVOKE CONNECT ON DATABASE ${DB_NAME} FROM PUBLIC, root;

  SELECT usename, application_name, query, pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE
    -- don't kill my own connection!
    pid <> pg_backend_pid()
    -- don't kill the connections to other databases
  AND datname = '${DB_NAME}';

  DROP DATABASE IF EXISTS ${DB_NAME};
  DROP USER IF EXISTS ${DB_NAME};
  CREATE USER ${DB_NAME};
  CREATE DATABASE ${DB_NAME};
  GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_NAME};
EOSQL

echo "Restore the dump file"
$POSTGRES_RUN_COM "psql -U ${DB_NAME}" < $DUMPS_PATH
