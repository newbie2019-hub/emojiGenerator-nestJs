import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AppService } from '../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let server: App;
  let appService: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appService = app.get<AppService>(AppService);

    server = app.getHttpServer();
    await app.init();
  });

  describe(`/ GET`, () => {
    it(`should return a 403 when an invalid apiKey is used`, () => {
      return request(server).get('/').set(`x-api-key`, 'INVALID').expect(403);
    });

    it(`should return a 403 when no apiKey is passed in`, () => {
      return request(server).get('/').expect(403);
    });

    it(`should return a random emoji`, () => {
      const emojis = appService.getEmojis();

      return request(server)
        .get('/')
        .set(`x-api-key`, 'SECRET')
        .expect(200)
        .expect(({ body }) => {
          console.log('Body: ', body);
          expect(emojis).toContain(body.data.emoji);
          expect(body.data.browser).toBeUndefined();
        });
    });

    it(`valid index query param returns respective emoji`, () => {
      const emojis = appService.getEmojis();

      return request(server)
        .get('/?index=1')
        .set(`x-api-key`, 'SECRET')
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.emoji).toBe(emojis[1]);
        });
    });

    it(`should return 400 when index is out of range`, () => {
      const emojis = appService.getEmojis();

      return request(server)
        .get(`/?index=${emojis.length + 1}`)
        .set(`x-api-key`, 'SECRET')
        .expect(400);
    });

    it(`should return 400 when index is non-number`, () => {
      return request(server)
        .get(`/?index=abcdef`)
        .set(`x-api-key`, 'SECRET')
        .expect(400);
    });
  });

  // /?index=non-number GET should return 400
});
