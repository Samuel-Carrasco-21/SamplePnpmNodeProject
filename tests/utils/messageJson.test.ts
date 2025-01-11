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
