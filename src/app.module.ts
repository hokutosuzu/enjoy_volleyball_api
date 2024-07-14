import { Module } from '@nestjs/common';
import { ItemsModule } from './modules/items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(), ItemsModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
