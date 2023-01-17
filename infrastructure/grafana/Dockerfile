FROM grafana/grafana-oss:9.1.0

ENV GF_INSTALL_PLUGINS=grafana-simple-json-datasource

COPY /provisioning/datasources /etc/grafana/provisioning/datasources/
COPY /provisioning/dashboards /etc/grafana/provisioning/dashboards/

EXPOSE 3000 