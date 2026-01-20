import { Mutation, Resolver, Args, Query, Context } from '@nestjs/graphql';
import { UserOrdersService } from './user-orders.service';
import { UserOrder } from './entities/user-order.entity';
import { CreateUserOrderInput } from './dto/create-user-order.input';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload';
import { UserOrderOutput } from './dto/user-order.output';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RetryUserOrderPaymentInput } from './dto/retry-user-order-payment.input';
// import { UpdateUserOrderInput } from './dto/update-user-order.input';

@Resolver(() => UserOrder)
@UseGuards(AuthGuard)
export class UserOrdersResolver {
  constructor(private readonly userOrdersService: UserOrdersService) {}

  // Create a new UserOrder
  @Mutation(() => UserOrder)
  async createUserOrder(
    @Args('createUserOrderInput') createUserOrderInput: CreateUserOrderInput,
    @Context('req') req: { user: JwtPayload }, // Access the user from the request context
  ): Promise<UserOrderOutput> {
    return this.userOrdersService.create(req.user, createUserOrderInput);
  }

  // Retry UserOrder payment
  @Mutation(() => UserOrder)
  async retryUserOrderPayment(
    @Args('retryUserOrderPaymentInput')
    retryUserOrderPaymentInput: RetryUserOrderPaymentInput,
    @Context('req') req: { user: JwtPayload },
  ): Promise<UserOrderOutput> {
    return this.userOrdersService.retryUserOrderPayment(
      req.user,
      retryUserOrderPaymentInput,
    );
  }

  @Mutation(() => UserOrder)
  async createRewardOrder(
    @Args('createUserOrderInput') createUserOrderInput: CreateUserOrderInput,
    @Context('req') req: { user: JwtPayload }, // Access the user from the request context
  ): Promise<UserOrderOutput> {
    return this.userOrdersService.createRewardOrder(
      req.user,
      createUserOrderInput,
    );
  }

  // // Update an existing UserOrder
  // @Mutation(() => UserOrder)
  // async updateUserOrder(
  //   @Args('id') id: string,
  //   @Args('updateUserOrderInput') updateUserOrderInput: UpdateUserOrderInput,
  //   @Context('req') req: { user: JwtPayload }, // Access the user from the request context
  // ): Promise<UserOrder> {
  //   const userId = req.user.id; // Extract the user ID from the JWT payload
  //   return this.userOrdersService.update(id, {
  //     ...updateUserOrderInput,
  //     userId,
  //   });
  // }

  // // Delete a UserOrder (optional)
  // @Mutation(() => Boolean)
  // async removeUserOrder(
  //   @Args('id') id: string,
  //   @Context('req') req: { user: JwtPayload }, // Access the user from the request context
  // ): Promise<boolean> {
  //   const userId = req.user.id; // Extract the user ID from the JWT payload
  //   return this.userOrdersService.remove(id, userId);
  // }

  // Get all UserOrders for the logged-in user
  @Query(() => [UserOrderOutput])
  async getUserOrders(
    @Context('req') req: { user: JwtPayload }, // Access the user from the request context
  ): Promise<UserOrderOutput[]> {
    const userId = req.user.id; // Extract the user ID from the JWT payload
    return this.userOrdersService.findAll(userId);
  }

  // Get a specific UserOrder by ID for the logged-in user
  @Query(() => UserOrderOutput)
  async getUserOrder(
    @Args('id') id: string,
    @Context('req') req: { user: JwtPayload }, // Access the user from the request context
  ): Promise<UserOrderOutput> {
    const userId = req.user.id; // Extract the user ID from the JWT payload
    return this.userOrdersService.findOne(id, userId);
  }
}
