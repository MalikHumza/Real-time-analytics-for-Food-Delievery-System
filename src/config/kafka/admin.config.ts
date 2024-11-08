import { logger } from '@infrastructure/common/logger';
import { admin } from './kafka.config';

const topic = 'order-updates';
const numberOfPartitions = 4;

export async function initializeTopicsByAdmin() {
  await admin.connect();

  logger.info(`=================================`);
  logger.info(`🚀 Admin Connected`);
  logger.info(`=================================`);

  await admin.createTopics({
    topics: [
      {
        topic,
        numPartitions: numberOfPartitions,
      },
    ],
  });

  logger.info(`=================================`);
  logger.info(
    `🚀 Topic ${topic} with num Of Partitions ${{ numberOfPartitions }} created Successfully..`,
  );
  logger.info(`=================================`);

  await admin.disconnect();
}
