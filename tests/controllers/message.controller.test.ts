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
