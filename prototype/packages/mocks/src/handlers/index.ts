import { orderHandlers } from './orders';
import { leadHandlers } from './leads';
import { clientHandlers } from './clients';
import { materialHandlers } from './materials';
import { userHandlers } from './users';
import { faceControlHandlers } from './face-control';

export const handlers = [
  ...orderHandlers,
  ...leadHandlers,
  ...clientHandlers,
  ...materialHandlers,
  ...userHandlers,
  ...faceControlHandlers,
];
