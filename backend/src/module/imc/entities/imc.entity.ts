import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('imc')
export class Imc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  peso: number;

  @Column('float')
  altura: number;

  @Column('float')
  imc: number;

  @Column()
  categoria: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha: Date;

  @ManyToOne(() => User, (user) => user.imc, { onDelete: 'CASCADE' })
  user: User;
}
