import { FcmTopicType } from '../enums/fcm-topic-type';
import { LanguageCode } from '../enums/language-code';

type TopicType = FcmTopicType | LanguageCode;

export interface SendFcmTokenInterface {
  userId: string;
  token: string | string[];
  topics: TopicType[];
  unTopics?: TopicType[];
}
