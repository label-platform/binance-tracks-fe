import platform from 'platform';
import ErrorStackParser from 'error-stack-parser';

export class Exception extends Error {
    system: string;

    client: string;

    time: string;

    filename: string;

    line?: number;

    column?: number;

    constructor(message: any) {
        super(message);

        this.time = new Date().toISOString();
        this.system = platform.os.toString();
        this.client = `${platform.name} ${platform.version}`;
        const info = ErrorStackParser.parse(this)[0];
        this.filename = `${info?.fileName}`;
        this.line = info?.lineNumber;
        this.column = info?.columnNumber;
    }

    async save() {
        const exceptionObject = {
            system: this.system,
            client: this.client,
            time: this.time,
            message: this.message,
            filename: this.filename,
            line: this.line,
            column: this.column,
            stack: this.stack,
        };
        /* TODO: 추후 에러 로그 관리 */
        console.log(exceptionObject);
    }
}

export class ServerError extends Exception {
    private _code: number;
    private _message: string;
    constructor(message: any, code: number) {
        super(message);

        Object.defineProperties(
            this,
            Object.freeze({
                _code: {
                    get: () => code,
                },
                _message: {
                    get: () => message,
                },
            })
        );
    }

    get code() {
        return this._code;
    }

    get message() {
        return this._message;
    }
}
