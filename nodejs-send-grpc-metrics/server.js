// Official documentation https://www.npmjs.com/package/@opentelemetry/sdk-metrics-base

const { MeterProvider } = require('@opentelemetry/sdk-metrics-base');
const { OTLPMetricExporter } =  require('@opentelemetry/exporter-metrics-otlp-grpc');
const collectorOptions = {
  // url is optional and can be omitted - default is grpc://localhost:4317
  url: 'grpc://192.168.20.34:4317',
};
const exporter = new OTLPMetricExporter(collectorOptions);

// Register the exporter
const meter = new MeterProvider({
  exporter,
  interval: 1000,
}).getMeter('example-exporter-collector');

;['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => provider.shutdown().catch(console.error));
});



// First, prepare the dimensions
const labels = { pid: process.pid, environment: 'staging', region: 'us1' };



// Now, start recording data
// 1. Counter 
// Choose this kind of metric when the value is a quantity, the sum is of primary interest, and the event count and value distribution are not of primary interest. It is restricted to non-negative increment
// datapoint value: 33, 71, 60, 21, 16, 85
// signalfx datapoint value: 33, 104, 164, 185, 201, 286
// signalfx type: delta rollup
const counter = meter.createCounter('my_grpc_sandbox_counter',{
  description: 'Example of a grpc counter'
});

// 2. UpDownCounter
// UpDownCounter is similar to Counter except that it supports negative increments. It is generally useful for capturing changes in an amount of resources used, or any quantity that rises and falls during a request.
// datapoint value: 68, -28, 100, -51
// signalfx datapoint value: 68, 40, 140, 89
// signalfx type: average rollup
const upDownCounter = meter.createUpDownCounter('my_grpc_sandbox_upDownCounter', {
  description: 'Example of a UpDownCounter'
});




// 3. ObservableGauge
// Observable Gauge
// Choose this kind of metric when only last value is important without worry about aggregation. The callback can be sync or async.
// datapoint value: 89.82681001912954, 67.79950351566491, 31.486280890595218, 32.96129448925844, 80.50162684418987
// signalfx datapoint value: 89.82681001912954, 67.79950351566491, 31.486280890595218, 32.96129448925844, 80.50162684418987
// signalfx type: average rollup
// const observableGauge = meter.createObservableGauge('my_grpc_sandbox_observableGauge', {
//   description: 'Example of an async observable gauge with callback',
// }, async (observableResult) => {
//   //await delay(2000);
//   const value = await getAsyncValue();
//   console.log("ObservableGauge",value)
//   observableResult.observe(value, labels);
// });

// 4. ObservableUpDownCounter
// Choose this kind of metric when sum is important and you want to capture any value that starts at zero and rises or falls throughout the process lifetime
// datapoint value: 53.765933534836186, 54.74114222302391, 64.14272643339218, 53.51021005024046, 96.85128811471195
// signalfx datapoint value: 53.765933534836186, 54.74114222302391, 64.14272643339218, 53.51021005024046, 96.85128811471195
// signalfx type: average rollup
// meter.createObservableUpDownCounter('my_grpc_sandbox_observableUpDownCounter', {
//   description: 'Example of an async observable up down counter with callback',
// }, async (observableResult) => {
//   const value = await getAsyncValue();
//   console.log("ObservableUpDownCounter",value)
//   observableResult.observe(value, labels);
// });

// 5. ObservableCounter
// Choose this kind of metric when collecting a sum that never decreases. The callback can be sync or async.
// datapoint value: 38.56350959927273, 49.92471437706518, 96.83731303822034, 96.62215193329205, 54.15856381946566
// signalfx datapoint value: 0, 11.36120, 46.91260, 4.135189
// signalfx type: delta rollup
// meter.createObservableCounter('my_grpc_sandbox_observableCounter', {
//   description: 'Example of an async observable counter with callback',
// }, async (observableResult) => {
//   const value = await getAsyncValue();
//   console.log("ObservableCounter",value)
//   observableResult.observe(value, labels);
// });



function getAsyncValue() {
  return new Promise((resolve) => {
    setTimeout(()=> {
      resolve((Math.random()* 100) + 1);
    }, 10000);
  });
}

setInterval(() => {
  //counter
  value = Math.floor(Math.random() * 100) + 1
  console.log("value", value)
  counter.add(value, labels );
  // updowncounter
  // randomN = Math.floor(Math.random() * 201) -100
  // console.log("randomN", randomN)
  // upDownCounter.add(randomN, labels);

}, 1000);