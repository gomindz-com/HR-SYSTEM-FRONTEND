// src/lib/offlineDB.ts
import Dexie, { Table } from "dexie";

export interface OfflineAction {
  id?: number;
  actionType: "check-in" | "check-out";
  qrPayload: string;
  scannedAt: string; // ISO timestamp
}

class OfflineDatabase extends Dexie {
  actions!: Table<OfflineAction, number>;

  constructor() {
    super("OfflineAttendanceDB");
    this.version(1).stores({
      actions: "++id, actionType, scannedAt",
    });
  }
}

export const offlineDB = new OfflineDatabase();
