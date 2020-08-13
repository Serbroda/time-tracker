export type TimeItemType = 'start' | 'stop' | 'start-break' | 'stop-break';
export interface TimeItem {
    _id?: string;
    name: string;
    date: string;
    time: string;
    created: Date;
    type: TimeItemType;
}
