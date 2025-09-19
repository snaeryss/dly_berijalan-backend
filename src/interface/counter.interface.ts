export interface ICounter {
  id: number;
  name: string;
  currentQueue: number;
  maxQueue: number;
  isActive: boolean;
}

export interface ICreateCounterResponse {
  counter: ICounter;
}

export interface IUpdateCounterResponse {
  counter: ICounter;
}

export interface IGetCounterResponse {
  counter: ICounter;
}

export interface IGetAllCountersResponse {
  counters: ICounter[];
}