import { BaseEntity } from '@app/database/entities/base.entity';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

import { UserRole } from '../enums/user-role';

@Entity({ schema: 'users', name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ length: 55 })
  role!: UserRole;

  @Column({
    select: false,
  })
  password!: string;

  @BeforeInsert()
  @BeforeUpdate()
  private encryptPassword(): void {
    if (!this.password) {
      return;
    }

    const salt = genSaltSync(10);

    this.password = hashSync(this.password, salt);
  }

  passwordCompare(password: string): boolean {
    return compareSync(password, this.password.replace(/^\$2y/, '$2a'));
  }
}
