import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsoleService } from './console.service';
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ConsoleService],
})
export class AppModule {}
