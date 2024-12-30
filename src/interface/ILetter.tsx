import {IPerson} from "./IPerson";

export interface ILetter {
    number: string,
    lettertext: string,
    senders: [],
    recipients: IPerson[],
    imageData: [],
    sender_locations: [],
    recipient_locations: [],
}
