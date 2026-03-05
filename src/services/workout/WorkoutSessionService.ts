import { WorkoutSession } from '../../types';
import { WorkoutRepository } from '../../database/repositories/WorkoutRepository';
import { WorkoutAnalyticsService } from '../analytics/WorkoutAnalyticsService';

export class WorkoutSessionService {
  static finalize(session: WorkoutSession): WorkoutSession {
    const endTime = new Date().toISOString();
    const totalVolumeKg = WorkoutAnalyticsService.calculateSessionVolume(session);
    const totalDurationSeconds = Math.max(
      0,
      Math.round((new Date(endTime).getTime() - new Date(session.startTime).getTime()) / 1000)
    );

    return {
      ...session,
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
