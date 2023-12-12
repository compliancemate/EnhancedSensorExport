import { mqtt, iot, mqtt5, auth } from 'aws-iot-device-sdk-v2';
import { Env } from '../processed-env';
import { ICrtError } from 'aws-crt';
import { AwsIotMqtt5ClientConfigBuilder } from 'aws-crt/dist/native/aws_iot_mqtt5';
import { AttemptingConnectEvent, ConnectionSuccessEvent, DisconnectionEvent, MessageReceivedEvent, StoppedEvent } from 'aws-crt/dist/common/mqtt5';
import { Method } from '../types/methods.types';
import moment from 'moment';
import { BasePayload } from '../models/base-payload.model';
import { AsTempAndRh } from '../models/asTempAndRh.model';
import { AsTempAndRhAggregate } from '../models/asTempAndRhAggregate.model';
import { AsBacklogTempAndRh } from '../models/asBacklogTempAndRh.model';
import { AsBacklogTempAndRhAggregate } from '../models/asBacklogTempAndRhAggregate.model';
import { ExportPackage, LocationAspect, MeasureAspect } from '../models/export-package.model';

let modernDevice: mqtt5.Mqtt5Client | undefined

const connectExternalMQTTNew = async () => {
    return new Promise<mqtt5.Mqtt5Client>((resolve, reject) => {
        const config = AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
            Env.NOTIFICATION_HOST_URL,
            Env.NOTIFICATION_CERT_PATH,
            Env.NOTIFICATION_KEY_PATH
        ).build();
        console.log(JSON.stringify(config, null, 2))

        const client: mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);

        client.on('attemptingConnect', (eventData: AttemptingConnectEvent) => {
            console.log(eventData)
        });
        client.on('connectionSuccess', (eventData: ConnectionSuccessEvent) => {
            console.log(eventData)
        });
        client.on('connectionFailure', (eventData) => {
            console.log(eventData)
        })
        client.on("messageReceived", (eventData: MessageReceivedEvent): void => {
            console.log("Message Received event: " + JSON.stringify(eventData.message));
        });
        client.on('error', (eventData: ICrtError) => {
            console.error(eventData)
        });
        client.on('disconnection', (eventData: DisconnectionEvent) => {
            console.error(eventData)
        });
        client.on('stopped', (eventData: StoppedEvent) => {
            console.error(eventData)
        });
        client.start();
        resolve(client);
    })
}

const connectCMWebsocket = async () => {
    return new Promise<mqtt.MqttClientConnection>((resolve, reject) => {
        const config = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
            credentials_provider: auth.AwsCredentialsProvider.newDefault(),
            region: Env.AWS_REGION
        })
            .with_clean_session(true)
            .with_client_id(`pub_sub_sample(${new Date()})`)
            .with_endpoint(Env.AWS_IOT_ENDPOINT)
            .with_keep_alive_seconds(30).build();
        console.log('Connecting websocket...');
        const client = new mqtt.MqttClient();

        const connection = client.new_connection(config);
        connection.on('connect', (sessionPresent) => {
            console.log(sessionPresent);
            resolve(connection);
        });
        connection.on('interrupt', (error) => {
            console.log(`Connection interrupted: error=${error}`);
        });
        connection.on('resume', (returnCode, sessionPresent) => {
            console.log(`Resumed: rc: ${returnCode} existing session: ${sessionPresent}`);
        });
        connection.on('disconnect', () => {
            console.log('Disconnected');
        });
        connection.on('error', (error) => {
            reject(error);
        });
        connection.connect();
    });
};

const connect = async () => {
    try {
        modernDevice = await connectExternalMQTTNew();
        const connection = await connectCMWebsocket();
        const topic = Env.TOPIC;
        console.log(`Subscribing to ${topic}`);
        connection.subscribe(topic, mqtt.QoS.AtLeastOnce, onMessage);

    } catch (error) {
        console.log(error);
    }
};

const onMessage: mqtt.OnMessageCallback = (topic: string, payload) => {
    try {
        const jsonString = Buffer.from(payload).toString();
        const totalObject: BasePayload = JSON.parse(jsonString);
        const locationObject: LocationAspect = (({ device_id, ...o }) => o)(totalObject.redis)
        const measurements: any[] = [];
        switch (totalObject.method) {
            case Method.asTempAndRh: {
                const asTempAndRh = <AsTempAndRh>totalObject;
                const measure: MeasureAspect = {
                    timeStamp: moment(asTempAndRh.metaData.time).toDate(),
                    sensorName: asTempAndRh.devId,
                    temperature: asTempAndRh.params.temperature,
                    batteryCapacity: asTempAndRh.params.batteryCapacity
                };
                measurements.push(measure);
                break;
            }
            case Method.asTempAndRhAggregate: {
                const asTempAndRhAggregate = <AsTempAndRhAggregate>totalObject;
                const parsedTimestamp = asTempAndRhAggregate.params.parsedTimestamp;
                const temps = asTempAndRhAggregate.params.temperature.reverse()
                for (let i = 0; i < temps.length; i++) {
                    const measure: MeasureAspect = {
                        timeStamp: moment(parsedTimestamp)
                            .subtract((i) * 5, "minutes").toDate(),
                        sensorName: asTempAndRhAggregate.devId,
                        temperature: asTempAndRhAggregate.params.temperature[i],
                        batteryCapacity: asTempAndRhAggregate.params.batteryCapacity

                    };
                    measurements.push(measure);
                }
                break;
            }
            case Method.asBacklogTempAndRh: {
                const asBacklogTempAndRh = <AsBacklogTempAndRh>totalObject;
                const measure: MeasureAspect = {
                    timeStamp: asBacklogTempAndRh.params.parsedTimestamp,
                    sensorName: asBacklogTempAndRh.devId,
                    temperature: asBacklogTempAndRh.params.temperature
                }
                measurements.push(measure);
                break;
            }

            case Method.asBacklogTempAndRhAggregate: {
                const asBacklogTempAndRhAggregate = <AsBacklogTempAndRhAggregate>totalObject;
                for (let i = 0; i < asBacklogTempAndRhAggregate.params.temperature.length; i++) {
                    const measure: MeasureAspect = {
                        timeStamp: moment(asBacklogTempAndRhAggregate.params.parsedTimestamp[i])
                            .subtract((i + 1) * 5, "minutes").toDate(),
                        sensorName: asBacklogTempAndRhAggregate.devId,
                        temperature: asBacklogTempAndRhAggregate.params.temperature[i]
                    }
                    measurements.push(measure);
                }
                break;
            }
            default:
                break;
        }

        if (measurements?.length) {
            for (const measure of measurements) {
                try {
                    const fullPayload: ExportPackage = Object.assign({}, locationObject, measure)
                    if (Env.CONVERT_TO_FARENHEIT) {
                        fullPayload.temperature = convertCelsiusToFarenheit(fullPayload.temperature);
                    }
                    console.log(JSON.stringify(fullPayload, null, 2));
                    const packet: mqtt5.PublishPacket = {
                        topicName: Env.NOTIFICATION_TOPIC_PUBLISH,
                        qos: mqtt5.QoS.AtMostOnce,
                        payload: Buffer.from(JSON.stringify(fullPayload)),
                        payloadFormat: mqtt5.PayloadFormatIndicator.Bytes
                    }
                    modernDevice?.publish(packet)
                } catch (error) {
                    console.error(error);
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const convertCelsiusToFarenheit = (temperature: number) => {
    return temperature * 9 / 5 + 32;
};


connect();



