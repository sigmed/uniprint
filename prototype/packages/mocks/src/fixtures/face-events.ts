import type { FaceControlEvent } from '@uniprint/types';
import { usersFixture } from './users';

const workersWithFace = usersFixture.filter((u) => u.faceTemplateId !== undefined);

export const faceEventsFixture: FaceControlEvent[] = workersWithFace.flatMap((u, i) =>
  Array.from({ length: 14 }, (_, d) => {
    const day = Math.floor(d / 2);
    const isEnter = d % 2 === 0;
    return {
      id: `fce_${u.id}_${day}_${isEnter ? 'in' : 'out'}`,
      userId: u.id,
      type: isEnter ? 'enter' : 'exit',
      at: new Date(2026, 4, 1 + day, isEnter ? 8 + (i % 2) : 17 + (i % 3), i % 60).toISOString(),
      vendor: 'mock',
      cameraId: 'cam_main',
      confidence: 0.96 + (i % 4) * 0.005,
    } satisfies FaceControlEvent;
  }),
);
