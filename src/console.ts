import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleService } from './console.service';
import { colors, start, parsePosition, parseInstruction } from './helper';

const { red, green, yellow } = colors;

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const consoleService = appContext.get(ConsoleService);

  console.info(green, 'Welcome to MartinRobots CLI');
  console.info(yellow, "Type 'exit' to end the program at any time");

  await start(appContext, consoleService);

  while (true) {
    await parsePosition(appContext, consoleService);
    const result = await parseInstruction(appContext, consoleService);
    if (result.includes('LOST')) {
      console.log(red, result);
      await start(appContext, consoleService);
    } else {
      console.log(green, `Result: ${result}`);
    }
  }
}

bootstrap();
