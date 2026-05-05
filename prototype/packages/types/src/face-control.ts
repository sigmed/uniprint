export type FaceControlEventType = 'enter' | 'exit' | 'unknown_face';

export interface FaceControlEvent {
  id: string;
  userId?: string;
  type: FaceControlEventType;
  at: string;
  vendor: 'mock' | 'ntechlab' | 'hikvision' | 'suprema';
  cameraId: string;
  confidence?: number;
  manualCorrectionEntryId?: string;
}

export interface ShiftCorrection {
  id: string;
  userId: string;
  eventId: string;
  byAdminUserId: string;
  oldTime: string;
  newTime: string;
  reason: string;
  at: string;
}
