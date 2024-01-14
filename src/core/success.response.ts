import httpStatusCode from "../utils/httpStatusCode";

type SuccessResponseConstructor = {
  message?: string;
  statusCode?: number;
  reasonMessage?: string;
  data?: any;
};

class SuccessResponse {
  message: string;
  status: number;
  data: any;

  constructor({
    message,
    statusCode = httpStatusCode.statusCodes.OK,
    reasonMessage = httpStatusCode.reasonPhrases.OK,
    data,
  }: SuccessResponseConstructor) {
    this.message = !message ? reasonMessage : message;
    this.status = statusCode;
    this.data = !data ? null : data;
  }

  send(res: any, _headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, data }: SuccessResponseConstructor) {
    super({ message, data });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    data,
    statusCode = httpStatusCode.statusCodes.CREATED,
    reasonMessage = httpStatusCode.reasonPhrases.CREATED,
  }: SuccessResponseConstructor) {
    super({ message, data, reasonMessage, statusCode });
  }
}

export { OK, CREATED };
