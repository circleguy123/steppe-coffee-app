import { Injectable } from '@nestjs/common';
// import { CreateMenuInput } from './dto/create-menu.input';
import { IikoService } from 'src/iiko/iiko.service';
import iikoConfig from 'src/_config/iiko.config';

@Injectable()
export class MenusService {
  constructor(private readonly iikoService: IikoService) {}

  // findAll() {
  //   return this.iikoService.getMenus();
  // }

  steppeMenu() {
    return this.iikoService.getMenuById();
  }

  rewardMenu() {
    return this.iikoService.getMenuById(iikoConfig.REWARD_MENU_ID);
  }

  membershipMenu() {
    return this.iikoService.getMenuById(iikoConfig.MEMBERSHIP_MENU_ID);
  }
}
