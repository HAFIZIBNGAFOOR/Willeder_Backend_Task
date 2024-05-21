import { ParamSchema, Location } from 'express-validator';
import { checkEmailExists, checkUserById, checkUserCredentials } from '../models/user';

export const VALIDATION_STRING = (where: Location): ParamSchema => ({
  in: [where],
  isString: true,
  notEmpty: true,
});

export const VALIDATION_EMAIL_NOT_EXIST = (where: Location): ParamSchema => ({
  in: [where],
  isEmail: true,
  custom: {
    options: async (value: string) => {
      const user = await checkEmailExists(value)
      if (user) {
        throw new Error('Email already exists');
      }
      return true;
    }
  }
});

export const VALIDATION_PASSWORD = (where: Location): ParamSchema => ({
  in: [where],
  isString: true,
  isLength: { options: { min: 6 }, errorMessage: 'Password must be at least 6 characters long' },
});

export const VALIDATION_ACCOUNT_TEL = (where: Location): ParamSchema => ({
  in: [where],
  matches: {
    options: /^\d{10}$/ 
  },
});
export const VALIDATION_EMAIL_EXIST = (where: Location): ParamSchema => ({
  in: [where],
  isEmail: true,
  custom: {
    options: async (value: string) => {
      const user = await checkEmailExists(value)
      if (user) {
        return true;
        
      }
      throw new Error('Email not registered');
    }
  }
});


export const VALIDATION_PASSWORD_CHECK = (where: Location, emailField: string): ParamSchema => ({
  in: [where],
  isString: true,
  custom: {
    options: async (password: string, { req }) => {
      const email = req.body[emailField];
      const user = await checkUserCredentials(email, password);
      if (!user) {
        throw new Error('Invalid email or password');
      }
      req.user = user;
      return true;
    }
  }
});
export const VALIDATION_ACCOUNT_ID =(where: Location): ParamSchema => ({
  in: [where],
  isString: {
    errorMessage: 'User ID must be a string',
  },
  custom: {
    options: async (value:string,{req}) => {
      const user = await checkUserById(value); 
      if (!user) {
        throw new Error('Invalid User ID');
      }
      req.user = user; 
      return true;
    }
  }
});