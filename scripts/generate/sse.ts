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

  eventSource.addEventListener(version, (event) => {
    const data: string[] = JSON.parse(event.data);

    console.log('SSE updates:', data.join(', '));

    for (const file of data) sse.emit(file);
  });
}
