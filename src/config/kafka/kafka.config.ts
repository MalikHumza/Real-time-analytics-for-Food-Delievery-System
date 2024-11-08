import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'real-time-analytics',
  brokers: ['localhost:9092'],
});

export const admin = kafka.admin();
export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'food-group' });

export const initializeKafka = async () => {
  await producer.connect();
  await consumer.connect();
};
