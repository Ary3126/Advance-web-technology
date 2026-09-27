const { performance } = require('node:perf_hooks');

const baseUrl = process.env.API_URL || 'http://localhost:5000';
const token = process.env.AUTH_TOKEN;
const samples = Number(process.env.SAMPLES) || 3;

if (!token) {
  console.error('Set AUTH_TOKEN to a valid JWT before running the benchmark.');
  process.exit(1);
}

const requestTasks = async () => {
  const started = performance.now();
  const response = await fetch(`${baseUrl}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  });
  const elapsed = performance.now() - started;

  if (!response.ok) {
    throw new Error(`GET /api/tasks failed with HTTP ${response.status}`);
  }

  return {
    milliseconds: Number(elapsed.toFixed(2)),
    cache: response.headers.get('x-cache') || 'UNKNOWN'
  };
};

const run = async () => {
  const readings = [];
  for (let index = 0; index < samples; index += 1) {
    readings.push(await requestTasks());
  }

  const average = readings.reduce((total, reading) => total + reading.milliseconds, 0) / readings.length;
  console.table(readings);
  console.log(`Average: ${average.toFixed(2)} ms`);
  console.log('For uncached readings, use a temporary local copy with the cache lookup disabled, then restore it.');
};

run().catch((error) => {
  console.error(`Benchmark failed: ${error.message}`);
  process.exit(1);
});
