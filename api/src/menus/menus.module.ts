import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusResolver } from './menus.resolver';
import { IikoModule } from 'src/iiko/iiko.module';

@Module({
  imports: [IikoModule],
  providers: [MenusResolver, MenusService],
})
export class MenusModule {}
