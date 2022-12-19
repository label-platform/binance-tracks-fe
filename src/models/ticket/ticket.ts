import { Item } from '@models/item/item';
import { TicketType } from './ticket.interface';

export class Ticket extends Item {
    private readonly ticket: TicketType;
    constructor(props: TicketType) {
        super(props.item);
        this.ticket = props;
    }

    get description() {
        return this.ticket.description;
    }

    static createMock(item: Item, description: string) {
        const ticket: TicketType = {
            item: item.selfInfo,
            description,
        };
        return ticket;
    }
}

export const createTicket = (ticket: TicketType): Ticket | Record<string, any> => {
    return ticket?.item ? new Ticket(ticket) : {};
};
