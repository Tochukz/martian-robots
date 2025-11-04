import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConsoleService {
  private readonly logger = new Logger(ConsoleService.name);

  setBounds(input: string) {
    console.log(`Setting bounds ${input}`);
  }

  processPosition(input: string) {
    console.log(`Processing position ${input}`);
  }

  processInstruction(input: string) {
    console.log(`Processing instructiong ${input}`);
    return 'Instruction';
  }
}
