import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../../prisma/prisma.service'
import { JwtPayload, JwtPayloadWithRt } from '../types'
import { Request } from 'express'

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwtRT') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_REFRESH_SECRET_KEY'),
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req.get('authorization').replace('Bearer ', '').trim()
    if (!refreshToken) throw new Error('Refresh token not found')
    return { ...payload, refreshToken }
  }
}
