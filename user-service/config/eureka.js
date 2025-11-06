const Eureka = require('eureka-js-client').Eureka;
const ip = require('ip');

const eurekaHost = process.env.EUREKA_HOST || 'localhost';
const eurekaPort = process.env.EUREKA_PORT || 8761;
const hostName = process.env.HOSTNAME || 'localhost';
const ipAddr = ip.address();
const port = process.env.PORT || 3001;

const eurekaClient = new Eureka({
  instance: {
    app: 'user-service',
    instanceId: `user-service:${port}`,
    hostName: hostName,
    ipAddr: ipAddr,
    statusPageUrl: `http://${hostName}:${port}`,
    port: {
      '$': port,
      '@enabled': true,
    },
    vipAddress: 'user-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    registerWithEureka: true,
    fetchRegistry: true,
    leaseInfo: {
      renewalIntervalInSecs: 30,
      durationInSecs: 90,
    },
  },
  eureka: {
    host: eurekaHost,
    port: eurekaPort,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
});

module.exports = eurekaClient;
