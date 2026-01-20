import { Args, Query, Mutation, Resolver, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserSessionOutput } from './dto/user-session.output';
import { User } from 'src/users/entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt.payload';
import { AuthGuard } from './auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  signup(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.signup(createUserInput);
  }

  @Mutation(() => Boolean)
  requestCode(@Args('phone') phone: string) {
    return this.authService.requestCode(phone);
  }

  @Mutation(() => UserSessionOutput, { name: 'login' })
  login(@Args('phone') phone: string, @Args('code') code: string) {
    return this.authService.login(phone, code);
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  profile(@Context('req') req: { user: JwtPayload }) {
    return this.authService.profile(req);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  deleteAccount(@Context('req') req: { user: JwtPayload }) {
    return this.authService.deleteAccount(req.user.id);
  }
}
