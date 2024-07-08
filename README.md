# lego-iiot-interview

## Run the example

### Start server

Start the server on the default port `9000` by running:

```shell
npm run dev:server
```

It takes an optional argument, which is the HTTP port to listen on; e.g:

```shell
npm run dev:server -- 8888
```

### Start devices

Start one or more devices by running:

```shell
npm run dev:device -- http://localhost:9000 <name>
```

NB: Names of devices should be unique.

### Query server for connected devices and their telemetry

Running this command

```shell
curl --location 'localhost:9000/devices/'
```

can yield

```
[{"id":"d1","telemetry":{"osVersion":"0.1.0","cpuTemp":47}}]
```

### Send upgrade command to a specific device

Running this command

```shell
curl --location 'localhost:9000/devices/d1/upgrade' \
--header 'Content-Type: application/json' \
--data '{
    "targetVersion": "1.0.0"
}'
```

should yield

```
OK
```
