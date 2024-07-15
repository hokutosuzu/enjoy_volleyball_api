import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { ItemRepository } from '../repositories/item.repository';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { ItemStatus } from 'src/shared/enums/item/item-status.enum';
import { NotFoundException } from '@nestjs/common';

// ItemRepositoryモック作成
const mockItemRepository = () => ({
  // モック関数
  find: jest.fn(),
  findOne: jest.fn(),
  createItem: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

// モックデータ
const mockUser1 = {
  id: 1,
  userName: 'test1',
  password: '1234',
  status: UserStatus.PREMIUM,
};

const mockUser2 = {
  id: 2,
  userName: 'test2',
  password: '1234',
  status: UserStatus.FREE,
};

// テスト実行
describe('ItemServiceTest', () => {
  let itemsService;
  let itemRepository;

  // テスト前にインスタンスを生成
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: ItemRepository,
          useFactory: mockItemRepository,
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    itemRepository = module.get<ItemRepository>(ItemRepository);
  });

  // describe('Jestの練習', () => {
  //   it('test1', () => {
  //     const result = 1;
  //     const expected = 1;
  //     expect(result).toEqual(expected);
  //   });
  // });

  // findAll
  describe('findAll', () => {
    it('正常系', async () => {
      const expected = [];
      // モックの戻り値を設定
      itemRepository.find.mockResolvedValue(expected);

      // テスト実行
      const result = await itemsService.findAll();
      expect(result).toEqual(expected);
    });
  });

  // findById
  describe('findById', () => {
    it('正常系', async () => {
      const expected = {
        id: 1,
        name: 'PC',
        price: 50000,
        description: '',
        status: ItemStatus.ON_SALE,
        userId: mockUser1.id,
        user: mockUser1,
      };

      // モックの戻り値を設定
      itemRepository.findOne.mockResolvedValue(expected);

      // テスト実行
      const result = await itemsService.findById(1);
      expect(result).toEqual(expected);
    });

    it('異常系: 商品が存在しない', async () => {
      // モックの戻り値を設定
      itemRepository.findOne.mockResolvedValue(null);

      // テスト実行
      await expect(itemsService.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  // create
  describe('create', () => {
    it('正常系', async () => {
      const expected = {
        id: 1,
        name: 'PC',
        price: 50000,
        description: '',
        status: ItemStatus.ON_SALE,
        userId: mockUser1.id,
        user: mockUser1,
      };

      // モックの戻り値を設定
      itemRepository.createItem.mockResolvedValue(expected);

      const createItemDto = {
        name: 'PC',
        price: 50000,
        description: '',
      };

      // テスト実行
      const result = await itemsService.create(createItemDto, mockUser1);
      expect(result).toEqual(expected);
    });
  });

  // updateStatus
  describe('updateStatus', () => {
    const mockItem = {
      id: 1,
      name: 'PC',
      price: 50000,
      description: '',
      status: ItemStatus.ON_SALE,
      userId: mockUser1.id,
      user: mockUser1,
    };

    // 戻り値のテストでなく、サービス内でRepositoryのメソッドが呼ばれているかを確認
    it('正常系', async () => {
      // モックの戻り値を設定
      itemRepository.findOne.mockResolvedValue(mockItem);

      await itemsService.updateStatus(1, mockUser2);
      expect(itemRepository.save).toHaveBeenCalled();
    });

    it('異常系: 自身の商品を購入することはできない', async () => {
      // モックの戻り値を設定
      itemRepository.findOne.mockResolvedValue(mockItem);

      // テスト実行
      await expect(itemsService.updateStatus(1, mockUser1)).rejects.toThrow();
    });
  });

  // delete
  describe('delete', () => {
    const mockItem = {
      id: 1,
      name: 'PC',
      price: 50000,
      description: '',
      status: ItemStatus.ON_SALE,
      userId: mockUser1.id,
      user: mockUser1,
    };

    // 戻り値のテストでなく、サービス内でRepositoryのメソッドが呼ばれているかを確認
    it('正常系', async () => {
      // モックの戻り値を設定
      itemRepository.findOne.mockResolvedValue(mockItem);

      await itemsService.delete(1, mockUser1);
      expect(itemRepository.delete).toHaveBeenCalled();
    });

    it('異常系: 他人の商品を削除することはできない', async () => {
      // モックの戻り値を設定
      itemRepository.findOne.mockResolvedValue(mockItem);

      // テスト実行
      await expect(itemsService.delete(1, mockUser2)).rejects.toThrow();
    });
  });
});
