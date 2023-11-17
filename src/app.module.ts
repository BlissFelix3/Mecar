import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import redisConfig from './redis/redis.config';
import { RedisModule } from 'nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheModule } from './redis/redis.module';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MechanicModule } from './mechanic/mechanic.module';
import { CarOwnerModule } from './car-owner/car-owner.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import appConfig from './config/env_config';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [redisConfig, appConfig],
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        url: configService.get('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        keepConnectionAlive: true,
        dropSchema: false,
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      ttl: 60 * 60,
      max: 100,
    }),
    RedisCacheModule,
    AuthModule,
    MechanicModule,
    CarOwnerModule,
    CloudinaryModule,
    MailModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },

    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
        }),
    },
    AppService,
  ],
})
export class AppModule {}
