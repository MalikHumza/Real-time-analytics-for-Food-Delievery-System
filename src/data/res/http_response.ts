
type TData = string | number | boolean | object | object[];
export class HttpResponse {
    public data: TData;
    public error: boolean;
    public message?: string;

    constructor(
        data: TData,
        error: boolean = false,
        message?: string,
    ) {
        this.data = data;
        this.error = error;
        if (message) {
            this.message = message;
        }
    }
}
