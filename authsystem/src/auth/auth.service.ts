import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto, RegisterDto } from './dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Tokens } from './types'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: RegisterDto) {
    //genereate password
    const hash = await this.hashedData(dto.password)
    try {
      const user = await this.prisma.users.create({
        data: {
          email: dto.email,
          username: dto.userName,
          hash,
        },
      })
      const tokens = await this.signToken(
        user.id,
        user.email,
        user.role,
        user.username
      )
      const signature =
      await this.signTokennew(
        user.id,
        user.email,
         user.role,
        user.username
    
      )
      console.log("generated",signature)
      const response = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        role: user.role,
        signature,
      };
  
      // Optionally update refresh token hash if needed
      // await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
  
      // Return response with tokens, role, and signature
      return response;
      // await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
   
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken')
        }
      }
      throw error
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.users.findUnique({
      where: {
        username: dto.userName,
      },
    })

    if (!user) {
      throw new ForbiddenException('Credentials Incorrect')
    }

    // compare password

    const pwMatches = await argon.verify(user.hash, dto.password)
    // if password incorrect throw exception

    if (!pwMatches) {
      throw new ForbiddenException('Credentials Incorrect')
    }
    // send back the user

    const tokens = await this.signToken(
      user.id,
      user.email,
      user.role,
      user.username
    )
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await this.hashedData(refreshToken)
    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    })
  }

  async logout(userId: number) {
    await this.prisma.users.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    })
  }

  async refreshToken(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access Denied')
    }
    const refreshTokenMatches = await argon.verify(user.hashedRt, rt)
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied')
    }
    const tokens = await this.signToken(
      user.id,
      user.email,
      user.role,
      user.username
    )
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  hashedData(data: string) {
    return argon.hash(data)
  }

  async signToken(
    userId: number,
    email: string,
    role: string,
    username: string
  ): Promise<Tokens> {
    const payload = {
      sub: userId,
      username,
      email,
      role,
    }
    const secretAT = this.config.get<string>('JWT_SECRET_KEY')
    const secretRT = this.config.get<string>('JWT_REFRESH_SECRET_KEY')

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: 60 * 15 * 10,
        secret: secretAT,
      }),
      this.jwt.signAsync(payload, {
        expiresIn: 60 * 60 * 24 * 7,
        secret: secretRT,
      }),
    ])

    return {
      accessToken: at,
      refreshToken: rt,
      role,
    }
  }

async signTokennew(userId: number,  email: string,role: string,  username: string){
  var ellipticcurve = require("starkbank-ecdsa");
var Ecdsa = ellipticcurve.Ecdsa;
var PrivateKey = ellipticcurve.PrivateKey;

// Generate privateKey from PEM string
var privateKey = PrivateKey.fromPem("-----BEGIN EC PARAMETERS-----\nBgUrgQQACg==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEIODvZuS34wFbt0X53+P5EnSj6tMjfVK01dD1dgDH02RzoAcGBSuBBAAK\noUQDQgAE/nvHu/SQQaos9TUljQsUuKI15Zr5SabPrbwtbfT/408rkVVzq8vAisbB\nRmpeRREXj5aog/Mq8RrdYy75W9q/Ig==\n-----END EC PRIVATE KEY-----\n");

// Create message from json
let message = JSON.stringify({
    "info": [
        {
            "id": userId,
            "email": email,
            "role":role,
            "username":username
       
        }
    ]
});

const signature = await Ecdsa.sign(message, privateKey);

// Generate Signature in base64. This result can be sent to Stark Bank in header as Digital-Signature parameter
console.log(signature.toBase64());

// To double check if message matches the signature
let publicKey = privateKey.publicKey();
return(signature.toBase64());


}
}