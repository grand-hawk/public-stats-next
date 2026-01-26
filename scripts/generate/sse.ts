import EventEmitter from 'node:events';

import { EventSource } from 'eventsource';

declare const EdgeRuntime: string | undefined;

const environment: string = '{{environment}}';
const version: string = '{{version}}';

export const sse = new EventEmitter();
sse.setMaxListeners(0);

if (
  process.env.NEXT_RUNTIME !== 'edge' &&
  typeof EdgeRuntime !== 'string' &&
  environment !== 'development'
) {
  const sseUrl =
    process.env.SSE_URL ??
    `https://${environment}.public-stats-data-sse.railway.astrid.ovh/events`;
  const baseDelay = 4_000;
  const maxDelay = 32_000;

  let retryCount = 0;

  function createEventSource() {
    const eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => {
      console.log('SSE connection opened');
      retryCount = 0;
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();

      const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
      retryCount += 1;
      console.log(`SSE retry ${retryCount} in ${delay / 1_000}s`);
      setTimeout(createEventSource, delay);
    };

    eventSource.addEventListener(version, async (event) => {
      const files: string[] = JSON.parse(JSON.parse(event.data));

      console.log('SSE updates:', files.join(', '));

      for (const file of files)
        await Promise.allSettled(
          sse.listeners(file).map((callback) => Promise.resolve(callback())),
        );

      sse.emit('_settled');
    });
  }

  createEventSource();
}
