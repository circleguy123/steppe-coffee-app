import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { CreateCustomerInput } from './dto/customers/create-customer.input';
import IikoConfig from 'src/_config/iiko.config';
import { GetCustomerInfoResponse } from './dto/customers/get-customer-info-response.dto';
import { CreateTableOrderRequest } from './dto/orders/request/create-table-order-request.dto';
import { TableOrderResponse } from './dto/orders/response/table-order-response.dto';
import { ExternalMenuPreset } from './dto/menu/external-menu-preset.dto';
import { Menu } from 'src/menus/entities/menu.entity';
import { TerminalGroupDTO } from './dto/terminal/terminal-group.dto';
import iikoConfig from 'src/_config/iiko.config';
import { StopListResponseDto } from './dto/menu/stop-list-response.dto';
import { NomenclatureResponseDto } from './dto/menu/nomenclature-response.dto';

@Injectable()
export class IikoService {
  private apiUrl = `https://api-ru.iiko.services`;
  private IIKO_TOKEN_CACHE_KEY = 'iiko_token';
  private IIKO_MENUS_CACHE_KEY = 'iiko_menus';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
  ) {}

  private async getToken(): Promise<string> {
    const token = await this.cacheManager.get<string>(
      this.IIKO_TOKEN_CACHE_KEY,
    );
    if (token) return token;

    const { data } = await firstValueFrom(
      this.httpService.post(this.apiUrl + `/api/1/access_token`, {
        apiLogin: IikoConfig.API_LOGIN,
      }),
    );

    await this.cacheManager.set(
      this.IIKO_TOKEN_CACHE_KEY,
      data.token,
      60 * 60 * 1000,
    );

    return data.token;
  }

  async getMenus() {
    const cachedMenus = await this.cacheManager.get<Menu[]>(
      this.IIKO_MENUS_CACHE_KEY,
    );
    if (cachedMenus) return cachedMenus;

    const token = await this.getToken();
    const { data } = await firstValueFrom(
      this.httpService.post(
        this.apiUrl + `/api/2/menu`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );

    await this.cacheManager.set(
      this.IIKO_MENUS_CACHE_KEY,
      data.externalMenus,
      60 * 60 * 1000,
    );

    return data.externalMenus;
  }

  async getNomenclature(): Promise<NomenclatureResponseDto> {
    const token = await this.getToken();
    const { data } = await firstValueFrom(
      this.httpService.post<NomenclatureResponseDto>(
        this.apiUrl + `/api/1/nomenclature`,
        {
          organizationId: IikoConfig.ORGANIZATION_ID,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );

    return data;
  }

  async getMenuById(
    externalMenuId = IikoConfig.EXTERNAL_MENU_ID,
  ): Promise<ExternalMenuPreset> {
    const cachedMenu = await this.cacheManager.get<ExternalMenuPreset>(
      `iiko_menu_${externalMenuId}`,
    );
    if (cachedMenu) return cachedMenu;

    const token = await this.getToken();

    const { data: menu } = await firstValueFrom(
      this.httpService.post<ExternalMenuPreset>(
        this.apiUrl + `/api/2/menu/by_id`,
        {
          externalMenuId,
          organizationIds: [IikoConfig.ORGANIZATION_ID],
        },
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );

    const stopList = await this.getStopList();

    const allStopListProductIds = new Set<string>();
    stopList.terminalGroupStopLists.forEach((group) => {
      group.items.forEach((terminal) => {
        terminal.items.forEach((item) => {
          if (item.balance <= 0 && item.productId) {
            allStopListProductIds.add(item.productId);
          }
        });
      });
    });

    menu.itemCategories.forEach((category) => {
      category.items = category.items.filter((item) => {
        return !allStopListProductIds.has(item.itemId);
      });

      category.items.forEach((item) => {
        item.itemSizes.forEach((size) => {
          size.itemModifierGroups.forEach((modGroup) => {
            modGroup.items = modGroup.items.filter(
              (modItem) => !allStopListProductIds.has(modItem.itemId),
            );
          });
        });
      });
    });

    await this.cacheManager.set(
      `iiko_menu_${externalMenuId}`,
      menu,
      60 * 60 * 1000,
    );

    return menu;
  }

  async getStopList(
    organizationId: string = IikoConfig.ORGANIZATION_ID,
    terminalGroupId: string = IikoConfig.TERMINAL_GROUP_ID,
  ): Promise<StopListResponseDto> {
    const token = await this.getToken();

    const { data } = await firstValueFrom(
      this.httpService.post<StopListResponseDto>(
        this.apiUrl + `/api/1/stop_lists`,
        {
          organizationIds: [organizationId],
          terminalGroupsIds: [terminalGroupId],
          returnSize: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );

    return data;
  }

  async createCustomer(createCustomerInput: CreateCustomerInput) {
    const token = await this.getToken();
    const { data } = await firstValueFrom(
      this.httpService.post<{ id: string }>(
        this.apiUrl + `/api/1/loyalty/iiko/customer/create_or_update`,
        createCustomerInput,
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );

    return data.id;
  }

  async getCustomerById(id: string) {
    const token = await this.getToken();
    const { data } = await firstValueFrom(
      this.httpService.post<GetCustomerInfoResponse>(
        this.apiUrl + `/api/1/loyalty/iiko/customer/info`,
        {
          type: 'id',
          id,
          organizationId: IikoConfig.ORGANIZATION_ID,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );

    return data;
  }

  async createOrder(order: CreateTableOrderRequest) {
    const token = await this.getToken();
    const { data } = await firstValueFrom(
      this.httpService.post<TableOrderResponse>(
        this.apiUrl + `/api/1/order/create`,
        order,
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );

    return data;
  }

  async getTerminalGroup(
    organizationId = IikoConfig.ORGANIZATION_ID,
  ): Promise<TerminalGroupDTO> {
    const token = await this.getToken();
    const { data } = await firstValueFrom(
      this.httpService.post(
        this.apiUrl + `/api/1/terminal_groups`,
        {
          organizationIds: [organizationId],
        },
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );

    return data.terminalGroups.find(
      (group) => group.organizationId === organizationId,
    );
  }

  async addCustomerToCategory(
    customerId: string,
    categoryId: string = iikoConfig.MEMBERSHIP_CATEGORY_ID,
  ) {
    const token = await this.getToken();
    const { data } = await firstValueFrom(
      this.httpService.post(
        this.apiUrl + `/api/1/loyalty/iiko/customer_category/add`,
        {
          customerId,
          categoryId,
          organizationId: IikoConfig.ORGANIZATION_ID,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );

    return data;
  }

  async removeCustomerFromCategory(
    customerId: string,
    categoryId: string = iikoConfig.MEMBERSHIP_CATEGORY_ID,
  ) {
    const token = await this.getToken();
    const { data } = await firstValueFrom(
      this.httpService.post(
        this.apiUrl + `/api/1/loyalty/iiko/customer_category/remove`,
        {
          customerId,
          categoryId,
          organizationId: IikoConfig.ORGANIZATION_ID,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );

    return data;
  }
}
