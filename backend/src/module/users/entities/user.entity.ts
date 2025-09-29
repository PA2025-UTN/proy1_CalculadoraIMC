import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Imc } from '../../imc/entities/imc.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Imc, (imc) => imc.user, { cascade: true })
  imc?: Imc[];
}

