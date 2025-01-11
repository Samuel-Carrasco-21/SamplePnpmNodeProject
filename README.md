## Init Node + Pnpm + TS Project

### Before it

1. On the directory, init a git repository using:
```bash
git init
```

2. Create a `.gitignore` file with the next config:
```git
# Node dependencies (required)
/node_modules

# Build directory (required)
/dist

# To have own vscode config on project
/.vscode

# Enviorment variables (required)
.env

# Log directory
/logs

# To prevent unnecessary conflicts when merging
pnpm-lock.yaml
```

3. Commit the changes made
```bash
git add . && git commit -m "Adding .gitignore file on project"
```

### Now let's build it

1. Init project in node with default values:
```bash
pnpm init
```

2. Install dependencies on project:
```bash
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-prettier prettier eslint-config-prettier typescript tsconfig-paths @types/node ts-node-dev @types/express jest ts-jest @types/jest @types/winston husky

pnpm add express dotenv winston
```

3. Init the husky config:
```bash
pnpm dlx husky init
```

4. Within the generated `.husky` folder, insert into the `pre-commit` file the following code:
```
pnpm lint
pnpm test
```

5. Create a `.env` and `.env.sample` file, then add the following variables:

> [!CAUTION]
> Never share your PRODUCTION enviorment variables by adding them on `.env` file

```
## ENV
# DEVELOP (DEV)
NODE_ENV="development"
ENV_PORT="3000"
ENV_VERSION="1"

# PRODUCTION (PROD)
# NODE_ENV=
# ENV_PORT=
# ENV_VERSION=

## LOGGER
LOGGER_LEVEL=info
```

6. Create a `src` directory.

7. Create a directory named `src/config`. Within this directory, create a file called `config.ts` and populate it with the following code:
```typescript
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  apiVersion: Number(process.env.ENV_VERSION) || 1,
  loggerLevel: process.env.LOGGER_LEVEL || 'info'
};
```

8. Create a directory named `src/enums`. Within this directory, create a file called `enviorment.ts` and populate it with the following code:
```typescript
export enum EnvServer {
  DEVELOP = 'development',
  PRODUCTION = 'production',
}
```

9. Create a directory named `src/logger`. Within this directory, create a file called `logger.ts` and populate it with the following code:
```typescript
import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { EnvServer } from '../enums/enviorment';
import { lg, env } from '../../infrastructure/config/config';

// Ensure the logs directory exists
import { EnvServer } from '../enums/enviorment';
import { config } from '../config/config';
import winston from 'winston';
import fs from 'fs';
import path from 'path';

// Ensure the logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define the custom log format
const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${level}:[${timestamp}] ${message}`;
});

const logger = winston.createLogger({
  level: config.loggerLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD/MMM/YYYY:HH:mm:ss ZZ' }),
    winston.format.simple() // Replace with `myFormat` if you want the custom format
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
  ],
});

// Add console transport for the development environment
if (config.nodeEnv === EnvServer.DEVELOP) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'DD/MMM/YYYY:HH:mm:ss ZZ' }),
        myFormat
      ),
    })
  );
}

// Placeholder for production-specific logic
if (config.nodeEnv === EnvServer.PRODUCTION) {
  // TODO: implement logic to save data on production modules
}

export default logger;
```

10. Create a directory named `src/utils`.

11. Within the directory `src/utils`, create a file named `messageJson.ts` and populate it with the following code:
```typescript
interface IMessage {
  message: string;
};

export const sayHelloToUser = (username: string): IMessage => {
  return { message: `Hello ${username}, nice to meet you!` };
};

export const customMessage = (message: string): IMessage => {
  return { message };
};
```

12. Within the directory `src/utils`, create a file named `calculator.ts` and populate it with the following code:
```typescript
export const operateNumbers = (numOne: number, numTwo: number, operation: string): number => {
  switch(operation) {
    case '+':
      return numOne + numTwo;
    case '-':
      return numOne - numTwo;
    case '*':
      return numOne * numTwo;
    case '/':
      return numOne / numTwo;
    default:
      throw new Error('Invalid operation');
  };
};
```

13. Create a directory named `src/controllers`.

14. Within the directory `src/controllers`, create a file named `math.controller.ts` and populate it with the following code:
```typescript
import { Request, Response } from 'express';
import { operateNumbers } from '@/utils/calculator';
import logger from '@/logger/logger';

export const performMathOperation = (req: Request, res: Response) => {
  const logMethod: string = 'math.controller:performMathOperation::';
  const { numOne, numTwo, operation } = req.body;

  if (
    !numOne ||
    !numTwo ||
    !operation ||
    typeof numOne !== 'number' ||
    typeof numTwo !== 'number'
  ) {
    logger.error(`${logMethod} invalid inputs`);
    res.status(400).send({ message: 'Invalid inputs' });
    return;
  }

  try {
    const result = operateNumbers(numOne, numTwo, operation);
    logger.info(`${logMethod} result gotten`);
    res.send({ result });
  } catch (error) {
    console.error(error);
    logger.error(`${logMethod} invalid operation`);
    res.status(400).send({ message: 'Invalid operation' });
  }
};
```

15. Within the directory `src/controllers`, create a file named `message.controller.ts` and populate it with the following code:
```typescript
import { Request, Response } from 'express';
import { sayHelloToUser, customMessage } from '@/utils/messageJson';
import logger from '@/logger/logger';

export const greetUser = (req: Request, res: Response) => {
  const logMethod: string = 'message.controller:greetUser::';
  const { username } = req.body;

  if (!username) {
    logger.error(`${logMethod} username is required`);
    res.status(400).send({ message: 'Username is required' });
    return;
  }

  const greeting = sayHelloToUser(username);
  logger.info(`${logMethod} greeting`);
  res.send(greeting);
};

export const createCustomMessage = (req: Request, res: Response) => {
  const logMethod: string = 'message.controller:createCustomMessage::';
  const { message } = req.body;

  if (!message) {
    logger.error(`${logMethod} message is required`);
    res.status(400).send({ message: 'Message is required' });
    return;
  }

  const response = customMessage(message);
  logger.info(`${logMethod} sending message`);
  res.send(response);
};
```

16. Within the directory `src/controllers`, create a file named `root.controller.ts` and populate it with the following code:
```typescript
import { Request, Response } from 'express';
import logger from '@/logger/logger';

export const rootEndpoint = (_req: Request, res: Response) => {
  const logMethod: string = 'root.controller:rootEndpoint::';
  logger.info(`${logMethod} sending message`);
  res.send({ message: 'Hello World! My api is working great!' });
};
```

17. Create a directory named `src/routes`.

18. Within the directory `src/routes`, create a file named `route.ts` and populate it with the following code:
```typescript
import { Router } from 'express';
import { rootEndpoint } from '../controllers/root.controller';
import { createCustomMessage, greetUser } from '../controllers/message.controller';
import { performMathOperation } from '../controllers/math.controller';
import { config } from '../config/config';

const router = Router();

const API: string = `/api/v${config.apiVersion}`;

// Root endpoint
router.get(API, rootEndpoint);

// Message endpoints
router.post(`${API}/greet`, greetUser);
router.post(`${API}/message`, createCustomMessage);

// Math operations
router.post(`${API}/math`, performMathOperation);

export default router;
```

19. Create a `src/index.ts` file and insert:
```typescript
import { config } from './config/config';
import express from 'express';
import router from './routes/route';

const app = express();
const port = config.port;
const API: string = `/api/v${config.apiVersion}`;

app.use(express.json());
// app.use(express.static('public'));
// app.set('view engine', 'ejs');

// Use routes
app.use(router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}${API}`);
});
``` 

20. Create a `tsconfig.json` file and insert:
```json
{
  "compilerOptions": {
    "baseUrl": "./", 
    "paths": {
      "@/*": ["src/*"]
    },
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "strictNullChecks": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "resolveJsonModule": true,
    "noImplicitAny": true,
    "sourceMap": true,
    "experimentalDecorators": true,
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "tests", "dist"]
}
```

21. To init the eslint config run:
```bash
pnpm exec eslint --init
```

22. Add the next config to the `eslint.config.mjs`:
```javascript
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

const compat = new FlatCompat();

export default [
  {
    files: ['**/*.ts', '**/*.js'],
    ignores: ['node_modules/', 'dist/', 'build/', '*.config.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,

      ...prettierPlugin.configs.recommended.rules,

      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'off',

      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
];
```

23. Create a file named `prettier.config.js` and add the following code to the `prettier.config.js` file:
```javascript
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
};
```

24. Init the jest config by running:
```bash
pnpm dlx ts-jest config:init
```

25. On the generated file `jest.config.js` add the following code:
```typescript
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.ts?$": ["ts-jest",{}],
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/tests'],
};
```

26. Create a folder named `tests`.

27. Within the folder `tests`, create two folders:

* controllers

* utils

28. Within the folder `tests`, create a file named `tsconfig.json` and populate it with the following code:
```typescript
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "baseUrl": "./",
    "module": "commonjs",
    "experimentalDecorators": true,
    "strictPropertyInitialization": false,
    "isolatedModules": false,
    "strict": false,
    "noImplicitAny": false,
    "typeRoots" : [
      "../node_modules/@types"
    ]
  },
  "exclude": [
    "../node_modules", "../dist"
  ],
  "include": [
    "./**/*.ts"
  ]
}
```

29. Within the folder `tests/controllers`, create a file named `math.controller.test.ts` and populate it with the following code:
```typescript
import { performMathOperation } from '../../src/controllers/math.controller';
import { Request, Response } from 'express';

describe('performMathOperation', () => {
  it('returns the result of a valid math operation', () => {
    const req = {
      body: { numOne: 10, numTwo: 5, operation: '+' },
    } as Request;

    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    performMathOperation(req, res);

    expect(res.send).toHaveBeenCalledWith({ result: 15 });
  });

  it('returns 400 for invalid inputs', () => {
    const req = {
      body: { numOne: 'invalid', numTwo: 5, operation: '+' },
    } as unknown as Request;

    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    performMathOperation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: 'Invalid inputs' });
  });

  it('returns 400 for invalid operations', () => {
    const req = {
      body: { numOne: 10, numTwo: 5, operation: '%' },
    } as Request;

    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    performMathOperation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: 'Invalid operation' });
  });
});
```

30. Within the folder `tests/controllers`, create a file named `message.controller.test.ts` and populate it with the following code:
```typescript
import {
  greetUser,
  createCustomMessage,
} from '../../src/controllers/message.controller';
import { Request, Response } from 'express';

describe('greetUser', () => {
  it('greets the user with their username', () => {
    const req = {
      body: { username: 'John' },
    } as Request;

    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    greetUser(req, res);

    expect(res.send).toHaveBeenCalledWith({
      message: 'Hello John, nice to meet you!',
    });
  });

  it('returns 400 if username is missing', () => {
    const req = { body: {} } as Request;
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    greetUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: 'Username is required' });
  });
});

describe('createCustomMessage', () => {
  it('returns a custom message', () => {
    const req = {
      body: { message: 'Test message' },
    } as Request;

    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    createCustomMessage(req, res);

    expect(res.send).toHaveBeenCalledWith({ message: 'Test message' });
  });

  it('returns 400 if message is missing', () => {
    const req = { body: {} } as Request;
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    createCustomMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: 'Message is required' });
  });
});
```

31. Within the folder `tests/controllers`, create a file named `root.controller.test.ts` and populate it with the following code:
```typescript
import { Request, Response } from 'express';
import { rootEndpoint } from '../../src/controllers/root.controller';

describe('rootEndpoint', () => {
  it('returns the root message', () => {
    const req = {} as Request;
    const res = {
      send: jest.fn(),
    } as unknown as Response;

    rootEndpoint(req, res);

    expect(res.send).toHaveBeenCalledWith({
      message: 'Hello World! My api is working great!',
    });
  });
});
```

32. Within the folder `tests/utils`, create a file named `calculator.test.ts` and populate it with the following code:
```typescript
import { operateNumbers } from '../../src/utils/calculator';

describe('operateNumbers', () => {
  it('adds two numbers', () => {
    expect(operateNumbers(5, 3, '+')).toBe(8);
  });

  it('subtracts two numbers', () => {
    expect(operateNumbers(5, 3, '-')).toBe(2);
  });

  it('multiplies two numbers', () => {
    expect(operateNumbers(5, 3, '*')).toBe(15);
  });

  it('divides two numbers', () => {
    expect(operateNumbers(6, 3, '/')).toBe(2);
  });

  it('returns 0 for an invalid operation', () => {
    expect(() => operateNumbers(6, 3, '%')).toThrow('Invalid operation');
  });
});
```

33. Within the folder `tests/utils`, create a file named `messageJson.test.ts` and populate it with the following code:
```typescript
import { sayHelloToUser, customMessage } from '../../src/utils/messageJson';

describe('sayHelloToUser', () => {
  it('returns a greeting message for a user', () => {
    expect(sayHelloToUser('John')).toEqual({
      message: 'Hello John, nice to meet you!',
    });
  });
});

describe('customMessage', () => {
  it('returns a custom message', () => {
    expect(customMessage('Test message')).toEqual({ message: 'Test message' });
  });
});
```

34. At the `package.json` add or replace the following code:
```json
...
"main": "dist/index.js",
...
```

35. On the script section of the `package.json` add or change:
```json
...
"test": "jest",
"start": "node dist/index.js || echo 'Build not found. Run > pnpm build'",
"dev": "ts-node-dev --respawn --transpile-only --inspect src/index.ts",
"build": "tsc",
"format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,md}\"",
"lint": "eslint ./src ./tests"
...
```

36. Make a commit to save changes:
```json
git add . && git commit -m "Adding initial config for pnpm + TS + node project"
```

37. finally, to test the api, run:
```bash
pnpm run dev
# or just
pnpm dev
```

38. (optional) for a foundational software architecture, consider combining hexagonal and layered architecture. This approach leverages the strengths of each to create a robust, flexible design.
```
src/
│
├── api                   # Main Endpoint
│   ├── controllers/      # In hexagonal architecture, PORT refers to the web.
|   ├── middlewares/      # API's protectors
|   └── swagger/          # API's interface
|
├── app/                  # App Use Cases (application layer)
│   ├── dtos/             # Data Transfer Objects
│   ├── services/         # App Services
|   └── utils/            # App extra tools (utils)
│
├── domain/               # Business Logic (domain layer)
│   ├── models/           # Domain Models
│   ├── entities/         # Domain's Entity Interfaces
│   ├── interfaces/       # Repository Interfaces
|   └── logger/           # Register API activity
│
├── infrastructure/       # External Implementations (infrastructure layer)
|   ├── cache/            # Fast DB to make quick queries
│   ├── config/           # Configurations (db, app)
│   ├── entities/         # Entity Implementations
│   ├── repositories/     # Data Access Implementation
│   └── utils/            # General Tools and Utilities
│
└── index.ts              # App's Entry Point

tests/
│
├── api                   # Main Endpoint
│   ├── controllers/      # Check the requests and responses of the api
|   ├── middlewares/      # Verify the functionality of middlewares
|   └── swagger/          # Validate if swagger displays correctly
|
├── app/                  # App Use Cases (application layer)
│   ├── services/         # Check if services apply the correct business logic
|   └── utils/            # Prove that utils' methods work correctly
│
├── infrastructure/       # External Implementations (infrastructure layer)
    ├── repositories/     # Check if data is posted, gotten, put, deleted correctly from DB
    └── utils/            # Confirm that utils from this layer work
```
