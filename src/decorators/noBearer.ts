import { SetMetadata } from '@nestjs/common';

export const NoBearerAuth = () => SetMetadata('no-bearer', true);
