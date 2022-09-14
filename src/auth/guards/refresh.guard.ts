import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {}
