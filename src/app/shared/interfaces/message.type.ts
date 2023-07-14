import { IPayload } from "./payload.interface";

export interface Message {
  text: string;
  isOwner: boolean;
  payload: IPayload; 
}

