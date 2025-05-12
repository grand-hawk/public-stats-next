import ky from 'ky';

import { env } from '@scripts/updateData.env.mts';

export interface ControllerSuccess<T> {
  success: true;
  data: T;
}

export interface ControllerError {
  success: false;
  message: string;
  data: unknown;
}

export type ControllerResponse<T> = ControllerSuccess<T> | ControllerError;

export async function controller<T = unknown>(
  name: string,
  inputData: unknown = null,
) {
  const result = await ky
    .post(
      new URL(`/api/controller/${name}`, `https://${env.ANALYTICS_API_HOST}`),
      {
        json: {
          input: inputData,
        },
        headers: {
          authorization: `Basic ${env.ANALYTICS_API_AUTH}`,
        },
      },
    )
    .json<ControllerResponse<T>>();

  if (!result.success) throw new Error(result.message);
  return result.data;
}
