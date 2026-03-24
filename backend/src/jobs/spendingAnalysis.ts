import { patternService } from '../services/patternService';
import { logger } from '../utils/logger';

/**
 * Runs nightly.
 * Analyzes spending patterns for all users and detects boss battles.
 */
export const runSpendingAnalysis = async (): Promise<void> => {
  logger.info('⚙️  Nightly spending analysis started');
  try {
    await patternService.analyzeAllUsers();
    logger.info('✅ Spending analysis complete');
  } catch (err) {
    logger.error('Spending analysis job failed', { error: err });
  }
};
