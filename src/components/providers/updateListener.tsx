import { toaster } from '@/components/ui/toaster';
import { trpc } from '@/utils/trpc';

export default function UpdateListener() {
  const utils = trpc.useUtils();

  if (process.env.NODE_ENV !== 'development')
    trpc.update.onUpdate.useSubscription(undefined, {
      onData: (data) => {
        if (!data) return; // heartbeat sends false

        const id = toaster.create({
          id: 'update',
          title: 'Update available',
          type: 'info',
          description:
            'Site data has been updated, please refresh the page to see the latest data.',
          action: {
            label: 'Refresh',
            onClick: () => utils.invalidate(),
          },
        });
        toaster.pause(id);
      },
    });

  return null;
}
