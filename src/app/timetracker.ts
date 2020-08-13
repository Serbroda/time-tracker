import NeDB = require('nedb');
import * as path from 'path';
import moment = require('moment');
import { TimeItem, TimeItemType } from './timeitem';

export class TimeTracker {
    private readonly timesDb: NeDB;

    constructor() {
        this.timesDb = new NeDB({ filename: path.join(process.cwd(), 'times.db'), autoload: true });
    }
    public async start(): Promise<TimeItem> {
        return this.add('start');
    }

    public async stop() {
        return this.add('stop');
    }

    public async startBreak() {
        return this.add('start-break');
    }
    public async stopBreak() {
        return this.add('stop-break');
    }

    public async find(date?: Date) {
        const d = date ? date : new Date();
        const mom = moment(d);
    }

    public async add(type: TimeItemType, date?: Date): Promise<TimeItem> {
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
    }
}
