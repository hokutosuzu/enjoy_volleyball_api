import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from '../item/item.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_name', unique: true })
  userName: string;

  @Column({ name: 'password' })
  @Exclude({ toPlainOnly: true }) // レスポンスに含めない
  password: string;

  @Column({ name: 'status' })
  status: UserStatus;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetime',
    nullable: true,
    // precision: 0, // 秒単位までの精度
  })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date | null;

  // リレーション
  @OneToMany(
    // Itemを返す関数
    () => Item,
    // Itemのuserプロパティを返す関数
    (items) => items.user,
  )
  @JoinColumn({ name: 'item_id' })
  items: Item[];
}
