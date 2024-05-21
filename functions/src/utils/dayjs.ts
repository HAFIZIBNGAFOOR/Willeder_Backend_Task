import * as dayjs from 'dayjs';
import * as  utc from 'dayjs/plugin/utc';
import * as  timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc);
dayjs.extend(timezone)

export const getCurrentJST = () :string=> {
  const jstTime =dayjs().tz('Asia/Tokyo').format();
  return jstTime;
};

export const getAddToCurrentJST = (num: number, unit: dayjs.ManipulateType):string => {
  const currentJST = dayjs().tz('Asia/Tokyo').add(num,unit).format();
  return currentJST;
};

export const isAfterCurrentJST = (time: string):boolean => {
  const isAfterJST = dayjs().tz('Asia/Tokyo').isAfter(time)
  return isAfterJST
};
