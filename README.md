# Otel Metrics

## Repository consists of 2 projects

### Jenkins Prometheus Metrics

Sandbox environment to grab Jenkins Prometheus metrics via Otel into O11y.

- The docker-compose will launch an instance of the Splunk Otel Collector and Jenkins instance.
- The Otel Collector is scraping the Jenkins Prometheus metrics via the `prometheus_simple` receiver
- Install the Jenkins [Promethus Plugin](https://plugins.jenkins.io/prometheus/)
- Created an .env file with the following fields
```   
SPLUNK_ACCESS_TOKEN=<<token>   
SPLUNK_MEMORY_TOTAL_MIB=1024   
SPLUNK_REALM=<<realm>>   
OTEL_SERVICE_NAME=jenkins
```
- Launch the containers `docker-compose up`

---

### Otel Collector Metrics

Sample nodejs application to send Otel metrics via Otel grpc into O11y. The sample nodejs application has 5 type of Otel metrics:
  1. Counter
  2. UpDownCounter
  3. ObservableGuage
  4. ObervableUpDownCounter
  5. ObservableCounter 


- Comment the docker-compose.yaml according if required. We only required the otlp reciever and signalfx exporter.
- Launch the Otel docker container `docker-compose up`
- Perform a npm install to download the dependencies.
- Launch the nodejs application `node server.js`