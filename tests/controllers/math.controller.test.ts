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
