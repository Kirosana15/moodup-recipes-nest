import { randomBytes } from 'crypto';

export const generateCheck = () => randomBytes(20).toString('hex');
