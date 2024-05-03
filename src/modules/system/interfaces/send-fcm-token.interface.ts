import { FcmTopicType } from '../enums/fcm-topic-type';

export interface SendFcmTokenInterface {
  userId: string;
  token: string;
  topics: FcmTopicType[];
}
