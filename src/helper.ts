import { INestApplicationContext } from '@nestjs/common';
import { input } from '@inquirer/prompts';

import { ConsoleService } from './console.service';

export const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  white: '\x1b[37m',
  red: '\x1b[31m',
};

export function parseInput(input: string, defaultInput: string) {
  const trimedInput = input.trim();
  if (!trimedInput) {
    return defaultInput;
  }
  return trimedInput;
}

export async function parsePosition(
  appContext: INestApplicationContext,
  consoleService: ConsoleService,
  message?: string,
) {
  const defaultPosition = '1 1 E';
  const positionMessage =
    message ?? `Enter a position for your robot (${defaultPosition}): `;
  const positionAnswer = await input({ message: positionMessage });
  const result = consoleService.processPosition(
    parseInput(positionAnswer, defaultPosition),
  );
  await ifToExit(appContext, positionAnswer);
  if (!result) {
    const updatedMessage = `Position must be 2 interger and a letter(N, E, S , W) (${defaultPosition}):`;
    await parsePosition(appContext, consoleService, updatedMessage);
  }
}

export async function parseInstruction(
  appContext: INestApplicationContext,
  consoleService: ConsoleService,
  message?: string,
) {
  const defaultInstruction = 'RFRFRFRF';
  const instructionMessage =
    message ?? `Enter movement instructions (${defaultInstruction})`;
  const instructionAnswer = await input({ message: instructionMessage });
  await ifToExit(appContext, instructionAnswer);
  const result = consoleService.processInstructions(
    parseInput(instructionAnswer, defaultInstruction),
  );
  if (!result) {
    const updatedMessage = `Instruction must be a string of 1 or more of the letters L, R or F: (RLFFRF)`;
    return parseInstruction(appContext, consoleService, updatedMessage);
  }
  return result;
}

export async function ifToExit(
  appContext: INestApplicationContext,
  result: string,
) {
  if (result === 'exit') {
    console.info(colors.yellow, 'Goodbye!');
    await appContext.close();
    process.exit(0);
  }
}

export async function start(
  appContext: INestApplicationContext,
  consoleService: ConsoleService,
  message?: string,
) {
  const defaultValue = '20 35';
  const startMessage =
    message ??
    `Please enter the upper-right coordinates of your rectangular world (${defaultValue}):`;
  const answer = await input({ message: startMessage });
  await ifToExit(appContext, answer);
  const result = consoleService.setBounds(parseInput(answer, defaultValue));
  if (!result) {
    const updatedMessage = `Coordinates must be two integers seperated by a space. Maximum value of the integer is 50 (${defaultValue}):`;
    await start(appContext, consoleService, updatedMessage);
  }
}
