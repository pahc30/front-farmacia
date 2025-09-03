
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class RouteDataService {
    private data: any = {};

    setData(data: any): void {
        this.data = data;
    }

    getData(): any {
        return this.data;
    }

    getDataKey(key: any): any {
        return this.data[key];
    }

    setDataKey(key: any, data: any): void {
        this.data[key] = data;
    }
}
