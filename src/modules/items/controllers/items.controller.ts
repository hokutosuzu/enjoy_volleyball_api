import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ItemsService } from '../services/items.service';
import { Item } from 'src/shared/entities/item/item.entity';
import { CreateItemDto } from 'src/shared/dtos/item/create-item.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/shared/entities/user/user.entity';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('items')
// Handlerの実行前後に処理を挟む
// Entityの @Exclude を有効にするために ClassSerializerInterceptor を使用
@UseInterceptors(ClassSerializerInterceptor)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(): Promise<Item[]> {
    return await this.itemsService.findAll();
  }

  @Get(':id') // パスパラメータ、簡易なバリデーション
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Item> {
    return await this.itemsService.findById(id);
  }

  @Post() // リクエストボディ、バリデーション
  @Role(UserStatus.PREMIUM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Body() createItemDto: CreateItemDto,
    @GetUser() user: User,
  ): Promise<Item> {
    return await this.itemsService.create(createItemDto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Item> {
    return await this.itemsService.updateStatus(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: User,
  ): Promise<void> {
    await this.itemsService.delete(id, user);
  }
}
