export class ErrorHandler extends Error {
  statusCode:any;

  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const handleError = (err, res) => {
  let { statusCode } = err;
  const { message } = err;
  if (!statusCode) {
    statusCode = 500;
  }
  res.status(statusCode).json({
    errors: [
      {
        status: statusCode,
        title: message,
      },
    ],
  });
};