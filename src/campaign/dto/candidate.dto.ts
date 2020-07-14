import { IsNotEmpty, IsOptional } from 'class-validator';

export class CandidateDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  id?: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
