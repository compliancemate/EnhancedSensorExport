import dotenv from 'dotenv';

dotenv.config();

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            AWS_ACCESS_KEY_ID: string;
            AWS_REGION: string;
            AWS_SECRET_ACCESS_KEY: string;
            AWS_IOT_ENDPOINT: string;
            TOPIC: string;
            DEBUG: string;
            NOTIFICATION_CERT_PATH: string;
            NOTIFICATION_KEY_PATH: string;
            NOTIFICATION_CA_PATH: string;
            NOTIFICATION_TOPIC_PUBLISH: string;
            NOTIFICATION_HOST_URL: string;
            NOTIFICATION_TOPIC_SUBSCRIBE: string;
            CONVERT_TO_FARENHEIT: string;
        }
    }
}
process.env.TZ = 'UTC';
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsRegion = process.env.AWS_REGION || 'us-east-1';
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsIotEndpoint = process.env.AWS_IOT_ENDPOINT;
const topic = process.env.TOPIC;
const tIsDebug = process.env.DEBUG;
const debug = tIsDebug == null ? false : tIsDebug.toLowerCase().startsWith('t');
const notificationCertPath = process.env.NOTIFICATION_CERT_PATH;
const notificationKeyPath = process.env.NOTIFICATION_KEY_PATH;
const notificationCAPath = process.env.NOTIFICATION_CA_PATH;
const notificationTopicPublish = process.env.NOTIFICATION_TOPIC_PUBLISH;
const notificationHostUrl = process.env.NOTIFICATION_HOST_URL;
const tConvertToFarenheit = process.env.CONVERT_TO_FARENHEIT;
const convertToFarenheit = !tConvertToFarenheit?.trim() ? false : tConvertToFarenheit.trim().toLowerCase().startsWith('t') ? true : false;


export const Env = {
    AWS_ACCESS_KEY_ID: awsAccessKeyId,
    AWS_REGION: awsRegion,
    AWS_SECRET_ACCESS_KEY: awsSecretAccessKey,
    AWS_IOT_ENDPOINT: awsIotEndpoint,
    TOPIC: topic,
    DEBUG: debug,
    NOTIFICATION_CERT_PATH: notificationCertPath,
    NOTIFICATION_KEY_PATH: notificationKeyPath,
    NOTIFICATION_CA_PATH: notificationCAPath,
    NOTIFICATION_TOPIC_PUBLISH: notificationTopicPublish,
    NOTIFICATION_HOST_URL: notificationHostUrl,
    CONVERT_TO_FARENHEIT: convertToFarenheit
} as const;