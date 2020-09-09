docker build -t fayosaadi/multi-client -f ./client/Dockerfile ./client
docker build -t fayosaadi/multi-server -f ./server/Dockerfile ./server
docker build -t fayosaadi/multi-worker -f ./worker/Dockerfile ./worker

docker push fayosaadi/multi-client
docker push fayosaadi/multi-server
docker push fayosaadi/multi-worker

kubectl apply -f k8s

# pull latest images
kubectl rollout restart deployment/client-deployment
kubectl rollout restart deployment/server-deployment
kubectl rollout restart deployment/server-deployment
kubectl rollout restart deployment/redis-deployment
kubectl rollout restart deployment/postgres-deployment
