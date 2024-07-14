import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Item } from 'src/shared/entities/item/item.entity';
import { ItemStatus } from 'src/shared/enums/item/item-status.enum';
import { CreateItemDto } from 'src/shared/dtos/item/create-item.dto';
import { ItemRepository } from '../repositories/item.repository';
import { User } from 'src/shared/entities/user/user.entity';

@Injectable()
export class ItemsService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async findAll(): Promise<Item[]> {
    return await this.itemRepository.find();
  }

  async findById(id: number): Promise<Item> {
    const found = await this.itemRepository.findOne(id);
    if (!found) {
      throw new NotFoundException('商品が見つかりませんでした。');
    }

    return found;
  }

  async create(createItemDto: CreateItemDto, user: User): Promise<Item> {
    return await this.itemRepository.createItem(createItemDto, user);
  }

  async updateStatus(id: number, user: User): Promise<Item> {
    const item = await this.findById(id);

    if (item.userId === user.id) {
      throw new BadRequestException('自身の商品を購入することはできません。');
    }

    item.status = ItemStatus.SOLD_OUT;
    return await this.itemRepository.save(item);
  }

  async delete(id: string, user: User): Promise<void> {
    const item = await this.findById(Number(id));

    if (item.userId !== user.id) {
      throw new BadRequestException('自身の商品以外は削除できません。');
    }

    await this.itemRepository.delete(id);
  }
}
