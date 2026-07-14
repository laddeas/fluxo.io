import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private jwksClientInstance: JwksClient;

  constructor(private readonly configService: ConfigService) {
    const domain = this.configService.get<string>('AUTH0_DOMAIN', 'datafusion-ai.us.auth0.com');
    this.jwksClientInstance = new JwksClient({
      jwksUri: `https://${domain}/.well-known/jwks.json`,
      cache: true,
      rateLimit: true,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No authorization token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken: any = jwt.decode(token, { complete: true });
      if (!decodedToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const kid = decodedToken.header.kid;
      const key = await this.getSigningKey(kid);
      const publicKey = key.getPublicKey();

      const verifiedPayload = jwt.verify(token, publicKey, {
        audience: this.configService.get<string>('AUTH0_AUDIENCE', 'https://api.datafusion.io'),
        issuer: `https://${this.configService.get<string>('AUTH0_DOMAIN', 'datafusion-ai.us.auth0.com')}/`,
      }) as any;

      request.user = {
        userId: verifiedPayload.sub,
        email: verifiedPayload.email,
        tenantId: verifiedPayload.org_id || 'default-tenant-id',
        roles: verifiedPayload.roles || [],
      };

      return true;
    } catch (err: any) {
      throw new UnauthorizedException(`Token validation failed: ${err.message}`);
    }
  }

  private getSigningKey(kid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.jwksClientInstance.getSigningKey(kid, (err: any, key: any) => {
        if (err) return reject(err);
        resolve(key);
      });
    });
  }
}
