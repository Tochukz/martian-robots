## Martin Robot

### Description

Martin Robot is a CLI application that is used to operate the Robots in Mars.

### Setup

Install dependencies

```bash
$ npm install
```

Run unit test

```bash
$ yarn test
```

### Operation

1. Start the application in development environment

```bash
$ npx ts-node src/console.ts
```

2. To run a production build, build before running the applicaiton

```bash
$ yarn build
$ node dist/console.js
```

3. Follow the prompt to position and move your robots around

```bash
Please enter the upper-right coordinates of your rectangular world (20 35): > 5 3
Enter a position for your robot (1 1 E): >  1 1 E
Enter movement instructions (RFRFRFRF): > RFRFRFRF
```

Note that the prompts are followed by reasonable default input which you can accept by pressing enter.

The resulting position of the Robot will be displayed after every instruction input is entered.

```bash
Result: 1 1 E
```

4. To stop the program at any time, type the command _exit_

```bash
> exit
```

### More info

The CLI application is programed to validate CLI inputs, if input are invalid the user is prompted again to enter the correct input.
