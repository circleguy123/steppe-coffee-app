import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'wI1dkIDnEY888',
      signOptions: { expiresIn: '365d' },
    }),
  ],
  providers: [AdminResolver, AdminService],
})
export class AdminModule {}