import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { FcmPlatformType } from '../enums/fcm-platform-type';

@Entity({ name: 'fcm_tokens', schema: 'system' })
@Unique(['userId', 'deviceId'])
export class FcmTokenEntity extends BaseEntity {
  @Column({ type: 'text' })
  token!: string;

  @Column({ type: 'varchar', length: 15 })
  type!: FcmPlatformType;

  @Column({ type: 'varchar', length: 255 })
  deviceId!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user!: UserEntity;
}
