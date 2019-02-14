# TODOS
> TODO list web application


## Download
Run
```bash
git clone https://github.com/wel-shy/todos.git
```

## Build
Install typescript and compile to JavaScript:
```bash
npm install && npm run build && cp .env.example .env
```
This will initialise the project with dummy environment variables, the project requires:
```
DEBUG=false
TEST=false
SECRET=changetoasecret
MONGO_URI=mongodb://mongo/todo
```

## Run
Run standalone with:
```bash
npm run
```
This will use the mongo uri you provided in `.env`, or run with docker using:
```bash
docker-compose up --build
```

## Test
Testing requires a mongodb instance to connect to. Either start one with:
```bash
docker run -p 2017:2017 mongo:latest
```
then run:
```bash
npm run test
```

Or run:
```bash
docker-compose up --build -d && docker-compose exec web ash
npm run test
```
`npm run test being run inside the docker container`.