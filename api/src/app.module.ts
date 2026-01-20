import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MenusModule } from './menus/menus.module';
import { IikoModule } from './iiko/iiko.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { NotificationsModule } from './notifications/notifications.module';
import { UserOrdersModule } from './user-orders/user-orders.module';
import { EventsModule } from './events/events.module';
import { EpayModule } from './epay/epay.module';
import GraphQLJSON from 'graphql-type-json';
import { redisStore } from 'cache-manager-redis-yet';
import { GraphQLBigInt } from 'graphql-scalars';
import { MembershipModule } from './membership/membership.module';

const jwtFactory = {
  global: true,
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          url: configService.get('REDIS_URL'),
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 180, // 3 minutes
        };
      },
    }),
    JwtModule.registerAsync(jwtFactory),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: [process.cwd().replace(',', ''), 'src/schema.gql'].join(),
      resolvers: { JSON: GraphQLJSON, BigInt: GraphQLBigInt },
    }),
    UsersModule,
    AuthModule,
    MenusModule,
    IikoModule,
    NotificationsModule,
    UserOrdersModule,
    EventsModule,
    EpayModule,
    MembershipModule,
  ],
})
export class AppModule {}
