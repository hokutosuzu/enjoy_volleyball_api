import { Item } from 'src/shared/entities/item/item.entity';
import { EntityRepository } from 'typeorm';
import { CreateItemDto } from 'src/shared/dtos/item/create-item.dto';
import { ItemStatus } from 'src/shared/enums/item/item-status.enum';
import { User } from 'src/shared/entities/user/user.entity';
import { BaseRepository } from 'src/shared/repositories/BaseRepository';

@EntityRepository(Item)
export class ItemRepository extends BaseRepository<Item> {
  async createItem(createItemDto: CreateItemDto, user: User): Promise<Item> {
    const { name, price, description } = createItemDto;
    const item = this.create({
      name,
      price,
      description,
      status: ItemStatus.ON_SALE,
      user,
    });

    await this.save(item);
    return item;
  }
}
