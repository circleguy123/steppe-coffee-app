import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Membership } from './entities/membership.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { MembershipService } from './membership.service';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Membership)
@UseGuards(AuthGuard)
export class MembershipResolver {
  constructor(private readonly membershipService: MembershipService) {}

  @Mutation(() => Membership)
  async createMembership(
    @Context('req') req: { user: JwtPayload },
    @Args('productId') productId: string,
    @Args('cardId') cardId: string,
  ): Promise<Membership> {
    const userId = req.user.id;
    return this.membershipService.create(userId, productId, cardId);
  }

  @Mutation(() => Membership)
  async cancelMembership(
    @Context('req') req: { user: JwtPayload },
    @Args('membershipId') membershipId: string,
  ): Promise<Membership> {
    const userId = req.user.id;
    return this.membershipService.cancelMembership(userId, membershipId);
  }

  @Query(() => Membership, { nullable: true })
  async getCurrentMembership(
    @Context('req') req: { user: JwtPayload },
  ): Promise<Membership> {
    const userId = req.user.id;
    return this.membershipService.findOne(userId);
  }
}
