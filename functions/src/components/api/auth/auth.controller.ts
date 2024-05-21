import { Request, Response, NextFunction } from 'express';
import { logger } from 'firebase-functions/v1';
import {  decodeJwt, encodeJwt } from '../../../utils/jwt';
import * as service from './auth.service';
import {
  badImplementationException,
  dataNotExistException,
  unauthorizedException,
} from '../../../utils/apiErrorHandler';

import { getUser, getUserByEmail, updateDeleteToken, updateRefreshToken } from '../../../models/user';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, phone, address } = req.body;
    await service.createUser(email, password, name, phone, address);
    res.status(200).json("User registed successfully");
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    if (!user_id) throw badImplementationException('user_id is not set properly');

    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;

    const accessToken =  encodeJwt({ id: user_id }, ACCESS_TOKEN_EXPIRED_IN || '1m', 'access');
    const refreshToken = encodeJwt({ id: user_id }, REFRESH_TOKEN_EXPIRED_IN || '2m', 'refresh');
    await updateRefreshToken(user_id,refreshToken) 
    res.status(200).json({ accessToken, refreshToken });
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    if (!user_id) throw badImplementationException('user_id is not set properly');
    await updateDeleteToken(user_id) 
    res.status(200).json("User loged out successfully");
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const users = await getUserByEmail(email);
    if (users.length === 0) throw dataNotExistException('Email does not register');
    if (users.length > 1) throw badImplementationException('Something went wrong. Email is more than 1.');
    if (users[0].status !== 'active') throw unauthorizedException('This user is unauthorized.');
    service.forgotPassword(users[0]);
    res.status(200).json(true);
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, tokenId } = req.body;
    await service.updatePassword(password, tokenId);
    res.status(200).json(true);
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    const decoded = decodeJwt(refreshToken, 'refresh');

    const user = await getUser(decoded.id);
    if (!user) throw unauthorizedException('User is not exist');
    if (user.status !== 'active') throw unauthorizedException('This user is not active');
    if (user.refresh_token !== refreshToken) throw unauthorizedException('Refresh token is not valid');

    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;

    const accessToken = encodeJwt({ id: user.user_id }, ACCESS_TOKEN_EXPIRED_IN || '5m', 'access');
    const newRefreshToken = encodeJwt({ id: user.user_id }, REFRESH_TOKEN_EXPIRED_IN || '30d', 'refresh');

    await updateRefreshToken(decoded.id,refreshToken) 

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};
