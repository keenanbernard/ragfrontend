# Step 1: Start all services with Docker Compose
From project root, run:
```shell

docker-compose up --build
```
This command starts services:
- 
- Node Server (ragchatbot-server-1) at localhost:3001
- React Client (ragchatbot-client-1) at localhost:3000

# Step 2: Connect your Node container to Docker network
Run this command in another terminal to connect your Node server container to the Flask container via Docker's internal network:
```shell
docker network create rag_network
docker network connect rag_network ragchatbot-server-1
docker network connect rag_network pythonraglocal-rag_query-1
```

# Step 3: Restart Node.js container
```shell

docker restart ragchatbot-server-1
docker restart pythonraglocal-rag_query-1
```

This ensures your Node container can now resolve and communicate properly with the Flask container.

Verify connectivity with logs:
```shell
docker logs ragchatbot-server-1
docker logs pythonraglocal-rag_query-1
```