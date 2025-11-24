import React from "react";
import Handsontable from "handsontable";
import { HotTable } from "@handsontable/react";
import ImportHooks from "../components/Import";

interface Right {
  sheetname: string;
  sheetlist: any;
  fileRef: React.RefObject<any> | React.MutableRefObject<any>;

  sheetdata: any[][] | Handsontable.RowObject[];
  hotTableComponentRight:
    | React.RefObject<any>
    | React.MutableRefObject<any>;

  onFileSelectChange(e: React.ChangeEvent<HTMLInputElement>): any;
  onSheetSelectChange(e: string): any;
}

const RightHooks = (props: Right) => {
  const hotRightSettings = {
    colHeaders: true,
    rowHeaders: true,
    height: 305,
    minRows: 12,
    minCols: 8,
    // colWidth: 100,
    licenseKey: "non-commercial-and-evaluation",
    id: "table-right",
  };
  return (
    <>
      <div className="right" style={{ padding: 10, marginTop: -25 }}>
        <h1 style={{ marginRight: 3, textAlign: "right" }}>الملف المعدَّل</h1>
        <ImportHooks
          sheetname={props.sheetname}
          sheetlist={props.sheetlist}
          onFileSelectChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.onFileSelectChange(e)
          }
          onSheetSelectChange={(e: string) => props.onSheetSelectChange(e)}
          fileRef={props.fileRef}
        />
        <HotTable
          ref={props.hotTableComponentRight}
          data={props.sheetdata}
          style={{ width: "98%", direction: "ltr" }}
          settings={hotRightSettings}
          stretchH={"all"}
        />
      </div>
    </>
  );
};

export default RightHooks;
