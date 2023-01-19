#!/bin/bash

echo 'Backup MongoDB from docker...'

source "./.env"

tput setaf 3; echo -e "\nMONGO_LINK: ${MONGO_LINK}"
DB_NAME=$(echo $MONGO_LINK | grep -o  '[a-zA-Z_]\+$')
echo -e "DB_NAME: ${DB_NAME} \n"

# local variables
DUMPS_DIR='./dumps/mongo'
CONTAINER_NAME='dev_mongo'

tput setaf 2; echo 'Drop local mongo databases and restore new dump files...'

docker exec -i $CONTAINER_NAME sh -c "rm -rf ${DUMPS_DIR}" # Remove old dump files
docker cp $DUMPS_DIR $CONTAINER_NAME:$DUMPS_DIR
docker exec -i $CONTAINER_NAME sh -c "mongo ${DB_NAME} --eval 'db.dropDatabase();' && mongorestore $DUMPS_DIR"
