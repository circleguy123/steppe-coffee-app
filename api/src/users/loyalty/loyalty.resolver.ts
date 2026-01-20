import { Context, Query, Resolver } from '@nestjs/graphql';
import { LoyaltyService } from './loyalty.service';
import { GetCustomerInfoResponse } from 'src/iiko/dto/customers/get-customer-info-response.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload';

@Resolver(() => GetCustomerInfoResponse)
export class LoyaltyResolver {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Query(() => GetCustomerInfoResponse, { name: 'loyaltyUser' })
  @UseGuards(AuthGuard)
  loyalty(@Context('req') req: { user: JwtPayload }) {
    return this.loyaltyService.getLoyalty(req.user.id);
  }
}
