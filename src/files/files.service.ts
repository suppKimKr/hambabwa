import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { extname } from "path";
import { S3 } from "aws-sdk";
import * as uuid from "uuid";

@Injectable()
export class FilesService {
  constructor(
      private readonly configService: ConfigService
  ) {}

  async uploadFile(file: Express.Multer.File, path: string): Promise<S3.ManagedUpload.SendData> {
    const s3 = new S3();
    return await s3.upload({
      Bucket: this.configService.get('AWS_S3_IMAGE'),
      Body: file.buffer,
      ContentType: file.mimetype,
      Key: `${this.configService.get('AWS_S3_REPOSITORY')}/${path}/${uuid()}${extname(file.originalname)}`
    }).promise();
  }
}
