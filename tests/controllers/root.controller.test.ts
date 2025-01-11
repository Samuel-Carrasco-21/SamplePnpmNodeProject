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
