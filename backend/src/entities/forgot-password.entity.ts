import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { AbstractEntity } from './entity';

@Entity()
export default class ForgotPassword extends AbstractEntity {
  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  verificationCode: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresIn: Date;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.forgotPassword, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
