import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'countries', schema: 'system' })
export class CountryEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column({ length: 15 })
  code!: string;

  @Column({ nullable: true })
  sign?: string;

  @Column('boolean', { default: false, nullable: true })
  isAvailable?: boolean;

  @OneToMany(() => UserEntity, (user) => user.country)
  users?: UserEntity[];
}
