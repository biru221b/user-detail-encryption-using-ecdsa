import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
// import cors from 'cors'
async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors(); // Enable CORS
  app.use(helmet())
 
  app.useStaticAssets(join(__dirname, '..', 'public/files'), {
    prefix: '/public/files/',
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  await app.listen(5000)
}
bootstrap()
