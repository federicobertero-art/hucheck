/** Shift schedule for a single branch — start/end times as `"HH:mm"` strings. */
export interface ShiftSchedule {
  /** Unique id, equal to `branchId` (one schedule per branch). */
  id: string;
  /** Branch this schedule belongs to. */
  branchId: string;
  /** Morning shift start time (`"HH:mm"`). */
  morningStart: string;
  /** Morning shift end time (`"HH:mm"`). */
  morningEnd: string;
  /** Afternoon shift start time (`"HH:mm"`). */
  afternoonStart: string;
  /** Afternoon shift end time (`"HH:mm"`). */
  afternoonEnd: string;
  /** Night shift start time (`"HH:mm"`). */
  nightStart: string;
  /** Night shift end time (`"HH:mm"`). */
  nightEnd: string;
}
