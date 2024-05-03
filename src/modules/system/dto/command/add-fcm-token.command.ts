import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { FcmPlatformType } from '../../enums/fcm-platform-type';
import { FcmTopicType } from '../../enums/fcm-topic-type';

export class AddFcmTokenCommand {
  @ApiProperty({
    description:
      'The registration token provided by the Firebase Cloud Messaging service, used to identify the device or app instance for push notifications. It should be kept confidential and only shared with authorized services.',
    example: 'YOUR_FCM_REGISTRATION_TOKEN_HERE',
  })
  @IsNotEmpty({ message: 'FCM token is required and cannot be empty.' })
  @IsString({ message: 'FCM token must be a valid string.' })
  @MinLength(100, {
    message: 'FCM token must be at least 100 characters long.',
  })
  @MaxLength(4096, { message: 'FCM token must not exceed 4096 characters.' })
  readonly token!: string;

  @ApiProperty({
    required: true,
    description: 'Type of device platform (e.g., ANDROID, IOS)',
    enum: FcmPlatformType,
  })
  @IsEnum(FcmPlatformType, { message: 'Invalid platform type.' })
  readonly type!: FcmPlatformType;

  @ApiProperty({
    description: 'A unique identifier for the device.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'Device ID is required and cannot be empty.' })
  @IsString({ message: 'Device ID must be a valid string.' })
  readonly deviceId!: string;

  @ApiProperty({
    required: false,
    description:
      'List of topics the device should subscribe to for notifications.',
    enum: FcmTopicType,
    enumName: 'FcmTopicType',
    type: [FcmTopicType],
    isArray: true,
  })
  @IsArray({ message: 'Topics must be an array.' })
  @ArrayNotEmpty({ message: 'Topics array cannot be empty.' })
  @IsEnum(FcmTopicType, {
    each: true,
    message: 'Each topic must be a valid FcmTopicType enum value.',
  })
  readonly topics: FcmTopicType[] = [FcmTopicType.global];
}
