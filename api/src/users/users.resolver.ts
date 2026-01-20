import { Args, Context, Mutation, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload';
import { AuthGuard } from 'src/auth/auth.guard';
import { EpayUserCard } from './entities/epay-user-card.entity';

@UseGuards(AuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User, { name: 'updateProfile' })
  updateUser(
    @Args('name') name: string,
    @Args('surName', { nullable: true }) surName: string,
    @Args('birthDate', { nullable: true }) birthDate: string,
    @Context('req') req: { user: JwtPayload },
  ) {
    return this.usersService.update(req.user.id, {
      name,
      surName,
      birthDate,
    });
  }

  @Query(() => [EpayUserCard], { name: 'getUserCards' })
  async getUserCards(@Context('req') req: any): Promise<EpayUserCard[]> {
    return this.usersService.getUserCards(req.user.id);
  }

  @Mutation(() => [EpayUserCard], { name: 'removeCard' })
  async removeCard(
    @Args('cardId') cardId: string,
    @Context('req') req: any,
  ): Promise<EpayUserCard[]> {
    return this.usersService.removeCard(req.user.id, cardId);
  }
}
