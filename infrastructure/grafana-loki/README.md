# Setting up Grafana Loki with helm
1. ```helm repo add grafana https://grafana.github.io/helm-charts```
Response: ```"grafana" has been added to your repositories```
2. ```helm repo update```
3. ```helm install loki-stack grafana/loki-stack --values C:/path/to/project-repo/infrastructure/grafana-loki/values.yaml -n monitoring```