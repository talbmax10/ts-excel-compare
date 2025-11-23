import { MutableRefObject, RefObject } from "react";

const daff = require("daff");

const filterColumns = (table: any[][], excludedColumns: Set<string>) => {
  if (!table) {
    return [];
  }

  if (excludedColumns.size === 0) {
    return table;
  }

  const headerRow = table[0] || [];
  const columnsToKeep: number[] = [];

  headerRow.forEach((cell: any, index: number) => {
    const header = cell === null || cell === undefined ? "" : cell.toString();
    const trimmed = header.trim();

    if (!excludedColumns.has(trimmed)) {
      columnsToKeep.push(index);
    }
  });

  if (columnsToKeep.length === headerRow.length) {
    return table;
  }

  return table.map((row: any[]) =>
    columnsToKeep.map((colIndex) =>
      row && row[colIndex] !== undefined && row[colIndex] !== null
        ? row[colIndex]
        : ""
    )
  );
};

export const diff = (
  left: any[][],
  right: any[][],
  ref: RefObject<any> | MutableRefObject<any>,
  excludedColumns: string[] = []
) => {
  if (!ref.current || !ref.current.hotInstance) {
    return;
  }

  var instance = ref.current.hotInstance;
  var result = [];
  const excludedColumnsSet = new Set(excludedColumns.map((col) => col.trim()));
  let tableLeft = new daff.TableView(filterColumns(left, excludedColumnsSet));
  let tableRight = new daff.TableView(filterColumns(right, excludedColumnsSet));

  tableLeft.trim();
  tableRight.trim();

  var ct = daff.compareTables(tableLeft, tableRight);

  let align = ct.align();
  let output = new daff.TableView([]);
  let flags = new daff.CompareFlags();
  flags.show_unchanged = false;
  flags.always_show_header = true;
  flags.always_show_order = true;
  flags.never_show_order = false;
  flags.unchanged_context = true;

  var td = new daff.TableDiff(align, flags);
  td.hilite(output);

  if (output.height !== 0) {
    result = output.data;
    instance.loadData(result);
  }
};
