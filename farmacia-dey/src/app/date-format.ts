import { Injectable } from "@angular/core";
import { NativeDateAdapter } from "@angular/material/core";
const SUPPORTS_INTL_API = typeof Intl !== "undefined";

@Injectable()
export class DateFormat extends NativeDateAdapter {
  override useUtcForDisplay = true;

  override parse(value: any): Date | null {
    if (typeof value === "string" && value.indexOf("/") > -1) {
      const str = value.split("/");
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    }
    const timestamp = typeof value === "number" ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
}
