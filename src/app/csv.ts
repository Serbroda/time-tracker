import * as fs from 'fs';
import { AtLeast } from './models/AtLeast';
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

export type CsvHeaders<T> = {
    [key in keyof T]: string;
};

export interface CsvHeader {
    id: string;
    title: string;
}

export interface CsvOptions {
    delimiter: ',' | ';';
    quote: boolean;
}

export class Csv<T> {
    private readonly opt: CsvOptions;
    private doNotAppendForFirstWrite: boolean = false;

    constructor(private file: string, private headers: CsvHeaders<T>, options?: Partial<CsvOptions>) {
        this.opt = {
            ...{
                delimiter: ',',
                quote: false,
            },
            ...options,
        };
        if (!fs.existsSync(file)) {
            fs.closeSync(fs.openSync(file, 'w'));
            this.doNotAppendForFirstWrite = true;
        } else {
            setTimeout(async () => (this.doNotAppendForFirstWrite = (await this.count()) < 1), 10);
        }
    }

    public async read(): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            let items: T[] = [];
            fs.createReadStream(this.file)
                .pipe(csv({ delimiter: this.opt.delimiter }))
                .on('data', (row: any) => {
                    const headers = this.mapHeaders();
                    let item: any = {};
                    for (let key in row) {
                        const header = headers.find((h) => h.title === key);
                        if (header) {
                            item[header.id] = row[key];
                        }
                    }
                    items.push(item);
                })
                .on('end', () => {
                    resolve(items);
                });
        });
    }

    public async write(data: T | T[], append: boolean = true) {
        if (this.doNotAppendForFirstWrite) {
            append = false;
            this.doNotAppendForFirstWrite = false;
        }
        const records: T[] = Array.isArray(data) ? data : [data];
        return this.createWriter(append).writeRecords(records);
    }

    public async update(predicate: (this: void, value: T, index: number, obj: T[]) => boolean, item: Partial<T>) {
        const all = await this.read();
        const index = all.findIndex(predicate);
        const current = all[index];
        all[index] = { ...current, ...item };
        return this.write(all, false);
    }

    public async filter(predicate: (this: void, value: T, index: number, obj: T[]) => value is T): Promise<T[]> {
        const records = await this.read();
        return records.filter(predicate);
    }

    public async find(
        predicate: (this: void, value: T, index: number, obj: T[]) => value is T
    ): Promise<T | undefined> {
        const records = await this.read();
        return records.find(predicate);
    }

    public mapHeaders(): CsvHeader[] {
        const headers: CsvHeader[] = [];
        for (let key in this.headers) {
            headers.push({
                id: key,
                title: this.headers[key],
            });
        }
        return headers;
    }

    private createWriter(append: boolean = true) {
        return createCsvWriter({
            path: this.file,
            header: this.mapHeaders(),
            fieldDelimiter: this.opt.delimiter,
            alwaysQuote: this.opt.quote,
            append,
        });
    }

    public async count(): Promise<number> {
        return (await this.read()).length;
    }
}
