import NeDB = require('nedb');
import * as path from 'path';
import moment = require('moment');
import { TimeItem, TimeItemType } from './timeitem';
import { Csv } from './csv';
import { AtLeast } from './models/AtLeast';
import { runInThisContext } from 'vm';

export const genId = (): string => {
    return (Date.now() + Math.round(Math.random() * 36 ** 12)).toString(36);
};

export class TimeTracker {
    private readonly timesDb: NeDB;
    private readonly dateFormat = 'YYYY-MM-DD';
    private readonly timeFormat = 'HH:mm:ss';
    private readonly dateTimeFormat = `${this.dateFormat} ${this.timeFormat}`;
    private readonly csv: Csv<TimeItem>;
    private items: TimeItem[] = [];

    constructor() {
        this.timesDb = new NeDB({ filename: path.join(process.cwd(), 'times.db'), autoload: true });
        this.csv = new Csv<TimeItem>(path.join(process.cwd(), 'times.csv'), {
            _id: 'Id',
            name: 'Name',
            date: 'Date',
            start: 'Start',
            end: 'End',
            created: 'Created',
        });
    }
    public async start(): Promise<TimeItem> {
        await this.csv.read();
        const now = moment();
        const item: TimeItem = {
            _id: genId(),
            name: 'work',
            date: now.format(this.dateFormat),
            start: now.format(this.timeFormat),
            created: now.format(this.dateTimeFormat),
        };
        await this.csv.write([item]);
        return item;
    }

    public async stop(item: string | AtLeast<TimeItem, '_id'>) {
        //const id = typeof item === 'string' ? item : item._id!;
        const items = await this.csv.read();
        console.log('Items', items);
        const first = items[0] as TimeItem;
        this.csv.update((i) => i._id === first._id, { end: moment().format(this.timeFormat) });
    }

    /*public async startBreak() {
        return this.add('start-break');
    }
    public async stopBreak() {
        return this.add('stop-break');
    }

    public async find(date?: Date) {
        const d = date ? date : new Date();
        const mom = moment(d);
    }*/

    /*public async add(type: TimeItemType, date?: Date): Promise<TimeItem> {
        return new Promise<TimeItem>(async (resolve, reject) => {
            const mom = moment(date ? date : new Date());
            this.timesDb.insert<TimeItem>(
                {
                    name: 'default',
                    created: mom.toDate(),
                    date: mom.format('YYYY-MM-DD'),
                    time: mom.format('HH:mm'),
                    type: type,
                },
                (err: Error | null, doc: TimeItem) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc);
                    }
                }
            );
        });
    }*/
}
