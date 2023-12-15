import { CantonApiModel } from './canton-api.model';

export class CantonModel {
  kanCode: number;
  kanName: string;

  constructor(canton: CantonApiModel) {
    this.kanCode = Number(canton.kan_code[0]);
    this.kanName = canton.kan_name[0];
  }
}
