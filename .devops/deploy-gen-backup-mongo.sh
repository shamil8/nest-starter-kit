#!/bin/bash

source "./.env"

tput setaf 3; echo -e "\nREMOTE_SERV_USER: ${REMOTE_SERV_USER}"
echo -e "MONGO_LINK: ${MONGO_LINK}"
DB_NAME=$(echo $MONGO_LINK | grep -o  '[a-zA-Z_]\+$')
echo -e "DB_NAME: ${DB_NAME} \n"

# local variables
DUMPS_DIR='./dumps/mongo'
CONTAINER_NAME='dev_mongo'

tput setaf 2; echo 'Mongo generate and copy the dump file...'
mkdir -p $DUMPS_DIR
ssh $REMOTE_SERV_USER -f "mkdir -p ${DUMPS_DIR} && mongodump -d=${DB_NAME} -o=${DUMPS_DIR}"
scp -r $REMOTE_SERV_USER:"${DUMPS_DIR}/${DB_NAME}" $DUMPS_DIR

echo 'Drop local mongo database and restore new dump files...'

docker exec -i $CONTAINER_NAME sh -c "rm -rf ${DUMPS_DIR}" # Remove old dump files
docker cp $DUMPS_DIR $CONTAINER_NAME:$DUMPS_DIR
docker exec -i $CONTAINER_NAME sh -c "mongo ${DB_NAME} --eval 'db.dropDatabase();' && mongorestore $DUMPS_DIR"
