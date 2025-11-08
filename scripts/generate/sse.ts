import EventEmitter from 'node:events';

const environment: string = '{{environment}}';
const version: string = '{{version}}';

export const sse = new EventEmitter();

let eventSource: EventSource | null;
export function startSSE() {
  if (eventSource) return;
  if (environment === 'development') return;

  eventSource = new EventSource(
    `https://${environment}.public-stats-data-sse.railway.astrid.ovh/events`,
  );

  eventSource.addEventListener(version, (event) => {
    const data: string[] = JSON.parse(event.data);

    console.log('SSE updates:', data.join(', '));

    for (const file of data) sse.emit(file);
  });
}
