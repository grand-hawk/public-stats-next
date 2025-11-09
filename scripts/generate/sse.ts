import EventEmitter from 'node:events';

import { EventSource } from 'eventsource';

const environment: string = '{{environment}}';
const version: string = '{{version}}';

export const sse = new EventEmitter();

if (process.env.NEXT_RUNTIME !== 'edge' && environment !== 'development') {
  const eventSource = new EventSource(
    `https://${environment}.public-stats-data-sse.railway.astrid.ovh/events`,
  );

  eventSource.onopen = () => console.log('SSE connection opened');

  eventSource.addEventListener(version, async (event) => {
    const data: string[] = JSON.parse(JSON.parse(event.data));

    console.log('SSE updates:', data.join(', '));

    const listeners = sse.listeners(version);
    const callbackPromises = listeners.map((callback) =>
      Promise.resolve(callback()),
    );
    await Promise.allSettled(callbackPromises);

    sse.emit('_settled');
  });
}
