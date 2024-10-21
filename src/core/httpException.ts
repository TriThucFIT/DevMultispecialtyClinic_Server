export class HttpException extends Error {

    status: number;
    message: string;
    message_VN: string;

    constructor(status: number, message: string,  message_VN?: string) { 
        super(message);
        this.status = status;
        this.message = message;
        this.message_VN = message_VN;
    }
    
}