import { IsNotEmpty } from 'class-validator';
import { IVote } from '../interface/vote.interface';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class VoteDto implements IVote {
  @IsNotEmpty()
  @ApiModelProperty({ example: '5efdef074b294a156099d0d8' })
  candidateId!: string;
  @IsNotEmpty()
  @ApiModelProperty({ example: '5efdee7032659b4f24d179a6' })
  campaignId!: string;
  @IsNotEmpty()
  @ApiModelProperty({ example: 'M6884593' })
  hkId!: string;
}
