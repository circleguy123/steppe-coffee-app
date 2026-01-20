import { Resolver, Query } from '@nestjs/graphql';
import { MenusService } from './menus.service';
import { Menu } from './entities/menu.entity';
import { ExternalMenuPreset } from 'src/iiko/dto/menu/external-menu-preset.dto';

@Resolver(() => Menu)
export class MenusResolver {
  constructor(private readonly menusService: MenusService) {}

  @Query(() => ExternalMenuPreset, { name: 'steppeMenu' })
  steppeExternalMenu() {
    return this.menusService.steppeMenu();
  }

  @Query(() => ExternalMenuPreset, { name: 'rewardMenu' })
  rewardExternalMenu() {
    return this.menusService.rewardMenu();
  }

  @Query(() => ExternalMenuPreset, { name: 'membershipMenu' })
  membershipExternalMenu() {
    return this.menusService.membershipMenu();
  }
}
