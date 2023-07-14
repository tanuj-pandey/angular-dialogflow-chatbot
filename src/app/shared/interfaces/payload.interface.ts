import { IPayloadOption } from "./payload-option.interface";

export interface IPayload {
    type: string;
    options: IPayloadOption[];
}
