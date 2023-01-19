#!/bin/bash

echo 'Deploy backup MongoDB to docker...'

source "./.env"

tput setaf 3; echo -e "\nMONGO_LINK: ${MONGO_LINK}"
DB_NAME=$(echo $MONGO_LINK | grep -o  '[a-zA-Z_]\+$')
echo -e "DB_NAME: ${DB_NAME} \n"

# local variables
DUMPS_DIR='./dumps/mongo'
CONTAINER_NAME='dev_mongo'

tput setaf 2; echo 'Mongo generate and copy the dump file...'

docker exec -i $CONTAINER_NAME sh -c "rm -rf $DUMPS_DIR" # Remove old docker dump folder
docker exec -i $CONTAINER_NAME sh -c "mkdir -p ${DUMPS_DIR} && mongodump -d=${DB_NAME} -o=${DUMPS_DIR}"

mkdir -p $DUMPS_DIR # Create parents dirs
rm -rf $DUMPS_DIR  # Remove old local dump files

docker cp $CONTAINER_NAME:$DUMPS_DIR $DUMPS_DIR
