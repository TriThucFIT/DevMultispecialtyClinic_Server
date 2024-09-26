import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ActiveMQModule } from './activeMQ/avtiveMQ.module';
import { AdmissionModule } from './admission/Admisstion.module';
import { AppService } from './app.service';

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
  providers: [AppService, AuthModule, ActiveMQModule, AdmissionModule],
})
export class AppModule {}
