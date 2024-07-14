import { SetMetadata } from '@nestjs/common';

// リクエストのメタデータを設定する
export const Role = (...statuses: string[]) =>
  SetMetadata('statuses', statuses);
