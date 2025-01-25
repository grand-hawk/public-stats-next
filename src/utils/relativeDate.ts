import { formatDistanceToNow } from 'date-fns';

export default function relativeDate(date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
  });
}
