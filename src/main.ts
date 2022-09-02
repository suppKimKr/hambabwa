import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // .env 환경변수 관리
  const configService = app.get(ConfigService);

  // cookie-parser 사용
  app.use(cookieParser());

  // plainObject -> Class 자동 변환
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // API 호출시 도메인 이후 가장 앞에는 /api 가 붙음
  app.setGlobalPrefix('api');

  /* API 문서 자동생성 Swagger 모듈 세팅 Start */
  const configBuilder = new DocumentBuilder()
    .setTitle('강남함바 ^_^?')
    .setDescription('hambabwa API')
    .setVersion('1.0')
    .addTag('hamba')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authentication',
    )
    .build();

  const document = SwaggerModule.createDocument(app, configBuilder);

  SwaggerModule.setup('v1/api/docs', app, document, {
    customCss: '.swagger-ui section.models { display: none;}',
  });
  /* Swagger End */

  await app.listen(configService.get('PORT'));
  console.log(`ENV::: ${configService.get('NODE_ENV')}`);
}
bootstrap();
