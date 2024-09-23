import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ActiveMQModule } from './activeMQ/avtiveMQ.module';
import { AdmissionModule } from './admission/Admisstion.module';

@Module({
  imports: [
    AuthModule,
    ActiveMQModule,
    AdmissionModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: Boolean(process.env.DB_SYNC),
      dropSchema: Boolean(process.env.DB_DROP),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}