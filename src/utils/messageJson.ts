interface IMessage {
  message: string;
}

export const sayHelloToUser = (username: string): IMessage => {
  return { message: `Hello ${username}, nice to meet you!` };
};

export const customMessage = (message: string): IMessage => {
  return { message };
};
