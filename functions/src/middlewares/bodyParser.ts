import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';

const options: bodyParser.OptionsJson = {
  verify: (req: Request, res:Response, buf) => {
    if (req.originalUrl.startsWith('/stripe-webhooks')) req.rawBody = buf.toString();
  },
};

export default bodyParser.json(options);
