import { orderHandlers } from './orders.js';
import { leadHandlers } from './leads.js';
import { clientHandlers } from './clients.js';
import { materialHandlers } from './materials.js';
import { userHandlers } from './users.js';
import { faceControlHandlers } from './face-control.js';

export const handlers = [
  ...orderHandlers,
  ...leadHandlers,
  ...clientHandlers,
  ...materialHandlers,
  ...userHandlers,
  ...faceControlHandlers,
];
