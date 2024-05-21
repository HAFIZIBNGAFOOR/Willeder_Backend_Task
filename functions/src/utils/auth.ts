import { Request, Response, NextFunction } from 'express';
import { unauthorizedException } from './apiErrorHandler';
import { logger } from 'firebase-functions/v1';
import { decodeJwt } from './jwt';

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.headers,req.headers['authorization']);
    
    const bearer = req.headers['authorization'];
    console.log(bearer,bearer?.split(' ')[1]);

    const token = bearer?.split(' ')[1]
    if (!token) throw unauthorizedException('No token provided');
    const decoded = decodeJwt(token,'access')
    console.log(decoded,bearer,token);
    
    req.user = { user_id: decoded.id,name:decoded.name};
    next();
  } catch (err) {
    logger.warn(err);
    next(err);
  }
};
