

### Prerequisites (note that db structure changed: newVotingSystem.tar )
<pre>
//Redis
docker run -p 6379:6379 --name some-redis -d redis:6-alpine redis-server --appendonly yes

//Mongodb (change /tmp/dump if necessary)
docker run -v /tmp/dump:/dump -p 27017:27017 --name some-mongo -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=pass -d mongo:4.2.8-bionic

//example data must be imported for admin users and indexing (newVotingSystem.tar)
//test users: (admin,adminPass) (editor,editorPass)
docker exec -it some-mongo bash
mongorestore --uri="mongodb://mongoadmin:pass@localhost:27017/?authSource=admin" -d votingSystem /dump/votingSystem

</pre>

### Installation

```bash
$ yarn install
```

### Running the app

```bash
$ yarn build
$ yarn start:prod
```

### Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e
```

### API host
http://localhost:3000

### Swagger
http://localhost:3000/api-docs
