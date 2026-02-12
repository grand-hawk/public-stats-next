import { useParams } from 'next/navigation';

export function usePlaceInitials() {
  const params = useParams();
  return (params?.place as string) ?? 'mtc';
}
