import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { EpayService } from './epay.service';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload';
import { EpayOrderType } from '@prisma/client';
import { EpayInvoiceOutput } from './dto/epay-invoice.output';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GraphQLBigInt } from 'graphql-scalars';

@Resolver()
@UseGuards(AuthGuard)
export class EpayResolver {
  constructor(private readonly epayService: EpayService) {}

  @Mutation(() => EpayInvoiceOutput, { name: 'createInvoice' })
  async createInvoice(
    @Context('req') req: { user: JwtPayload },
    @Args('type', { type: () => EpayOrderType }) type: EpayOrderType,
    @Args('userOrderId', { nullable: true }) userOrderId?: string,
    @Args('membershipId', { nullable: true }) membershipId?: string,
  ) {
    return this.epayService.createEpayInvoice(
      req.user.id,
      type,
      userOrderId,
      membershipId,
    );
  }

  @Query(() => [EpayInvoiceOutput], { name: 'epayInvoices' })
  getUserInvoice(@Context('req') req: { user: JwtPayload }) {
    return this.epayService.getUserInvoices(req.user.id);
  }

  @Query(() => EpayInvoiceOutput, { name: 'epayInvoice' })
  getInvoiceById(
    @Context('req') req: { user: JwtPayload },
    @Args('id', { type: () => GraphQLBigInt }) id: number,
  ) {
    return this.epayService.getInvoiceById(req.user.id, id);
  }

  @Mutation(() => EpayInvoiceOutput, { name: 'cancelInvoice' })
  async cancelInvoice(
    @Context('req') req: { user: JwtPayload },
    @Args('id', { type: () => GraphQLBigInt }) id: number,
  ) {
    return this.epayService.cancelInvoice(req.user.id, id);
  }
}
