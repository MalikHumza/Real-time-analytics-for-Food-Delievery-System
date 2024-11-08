import { consumer } from '@config/kafka/kafka.config';
import { logger } from '@infrastructure/common/logger';

export const orderPlacedConsumerNotification = async () => {
  await consumer.subscribe({ topic: 'order-placed', fromBeginning: true });

  logger.info(`Consumer connected to topic order-updates`);

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      logger.info(`Received message on ${topic}: ${message.value.toString()}`);
    },
  });
};
