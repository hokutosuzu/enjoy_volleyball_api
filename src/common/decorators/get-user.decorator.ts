import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// 認証済みのユーザー情報を取得する
export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
