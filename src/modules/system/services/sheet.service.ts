import { Response } from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { utils, write } from 'xlsx';

export const bookTypes = {
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

type BookTypeKeys = keyof typeof bookTypes;

export class SheetService {
  createSheet(
    items: object[],
    sheetColumnNames: string[],
    bookType: BookTypeKeys,
    spaceLength = 3,
  ): Buffer {
    const sheetColumns = items.reduce((columns: string[][], item) => {
      /** Get values from item: object and push to columns like array */
      item && columns.push(Object.values(item));

      return columns;
    }, []);

    /** Set empty strings to sheetColumns for adding second sheet line in table */
    if (!sheetColumns.length) {
      sheetColumns[0] = Array(sheetColumnNames.length).fill('');
    }

    const workBook = utils.book_new();

    const workSheet = utils.aoa_to_sheet([sheetColumnNames, ...sheetColumns]);

    const colsArray: { wch: number }[] = [];

    // Uses for correct columns width
    sheetColumnNames.forEach((name, index) => {
      // Finds longest column value
      const columnLength = sheetColumns.reduce((previous, current) => {
        const currentLength = current[index] ? current[index].length : 0;
        const columnLength =
          previous > currentLength ? previous : currentLength;

        return columnLength;
      }, 0);

      const col =
        name.length > columnLength
          ? { wch: name.length }
          : { wch: String(sheetColumns[0][index]).length + spaceLength };

      colsArray.push(col);
    });

    workSheet['!cols'] = colsArray;

    utils.book_append_sheet(workBook, workSheet);

    return write(workBook, { bookType, type: 'buffer' });
  }

  sheetIsNaN(val: string): number {
    return isNaN(Number(val)) ? 0 : Number(val);
  }

  formatDate(date?: Date): string {
    return date
      ? new Date(date).toLocaleDateString('en-GB').replace(/\//g, '.')
      : '-';
  }

  parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('.').map(Number);

    return new Date(year, month - 1, day); // Months are 0-indexed
  }

  static setSheetRes(
    res: Response,
    fileName: string,
    file: Buffer,
    bookType: BookTypeKeys,
  ): void {
    res.contentType(bookTypes[bookType]);
    res.attachment(`${fileName}.${bookType}`);
    res.send(file);
  }
}
