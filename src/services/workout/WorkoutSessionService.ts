import { WorkoutSession } from '../../types';
import { WorkoutRepository } from '../../database/repositories/WorkoutRepository';
import { WorkoutAnalyticsService } from '../analytics/WorkoutAnalyticsService';
import { diffInSeconds } from '../../utils/date';

function validateSession(session: WorkoutSession): void {
  if (!session.name.trim()) throw new Error('Workout name is required.');
  if (!session.startTime) throw new Error('Workout start time is required.');
  if (Number.isNaN(Date.parse(session.startTime))) {
    throw new Error('Workout start time must be a valid ISO datetime.');
  }
}

export class WorkoutSessionService {
  static finalize(session: WorkoutSession): WorkoutSession {
    validateSession(session);

    const endTime = new Date().toISOString();
    const totalVolumeKg = WorkoutAnalyticsService.calculateSessionVolume(session);
    const totalDurationSeconds = diffInSeconds(session.startTime, endTime);

    return {
      ...session,
      name: session.name.trim(),
      endTime,
      totalVolumeKg,
      totalDurationSeconds,
    };
  }

  static async saveFinalized(session: WorkoutSession): Promise<WorkoutSession> {
    const finalized = WorkoutSessionService.finalize(session);
    await WorkoutRepository.save(finalized);
    return finalized;
  }
}
