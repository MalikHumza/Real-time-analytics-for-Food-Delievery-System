import { AppService } from '@data/services/app.service';
import { AppController } from '@infrastructure/controllers/app.controller';
import { HttpExceptionFilter } from '@infrastructure/middlewares/error.middleware';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, { provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule { }
