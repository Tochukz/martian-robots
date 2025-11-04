import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplicationContext } from '@nestjs/common';
import { input } from '@inquirer/prompts';
import { ConsoleService } from './console.service';

const green = '\x1b[32m';
const yellow = '\x1b[33m';
const white = '\x1b[37m';
const red = '\x1b[31m';

async function ifToExit(appContext: INestApplicationContext, result: string) {
  if (result === 'exit') {
    console.info(yellow, 'Goodbye!');
    await appContext.close();
    process.exit(0);
  }
}

async function start(
  appContext: INestApplicationContext,
  consoleService: ConsoleService,
) {
  const startMessage =
    'Please enter the upper-right coordinates of your rectangular world (20 35):';
  const answer = await input({ message: startMessage });
  await ifToExit(appContext, answer);
  consoleService.setBounds(answer);
}

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const consoleService = appContext.get(ConsoleService);

  console.info(green, 'Welcome to MartinRobots CLI');
  console.info(yellow, "Type 'exit' to end the program at any time");

  await start(appContext, consoleService);

  while (true) {
    const defaultPosition = '1 1 E';
    const positionMessage = `Enter a position for your robot ( ${defaultPosition}): `;
    const positionAnswer = await input({ message: positionMessage });
    consoleService.processPosition(positionAnswer ?? defaultPosition);
    await ifToExit(appContext, positionAnswer);

    const defaultInstruction = 'RFRFRFRF';
    const instructionMessage = `Enter movement instructions (${defaultInstruction})`;
    const instructionAnswer = await input({ message: instructionMessage });
    await ifToExit(appContext, instructionAnswer);
    const result = consoleService.processInstruction(
      instructionAnswer ?? defaultInstruction,
    );
    if (result.includes('LOST')) {
      console.log(red, result);
      await start(appContext, consoleService);
    } else {
      console.log(green, result);
    }
  }
}

bootstrap();
