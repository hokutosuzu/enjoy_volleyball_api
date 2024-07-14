import { Repository, DeleteResult } from 'typeorm';

export class BaseRepository<T> extends Repository<T> {
  async delete(id: number | string): Promise<DeleteResult> {
    return this.softDelete(id);
  }
}
