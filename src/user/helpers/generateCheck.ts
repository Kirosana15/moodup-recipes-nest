import { randomBytes } from 'crypto';

export const generateCheck = (): string => randomBytes(20).toString('hex');
