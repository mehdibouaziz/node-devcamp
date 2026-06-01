class ErrorResponse extends Error {
    statusCode : number;
    stack: string;

    constructor(message: string = 'Server Error', statusCode: number = 500, stack?: string) {
        super(message);
        this.statusCode = statusCode;
        this.stack = stack || 'No stack';
    }

    setMessage(message: string): void {
        this.message = message;
    }

    setStatus(statusCode: number): void {
        this.statusCode = statusCode;
    }
}

export default ErrorResponse;
