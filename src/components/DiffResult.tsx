import React from "react";
import { HotTable } from "@handsontable/react";
import { Button } from "antd";
import * as XLSX from "xlsx";
import { renderDiff } from "../utils/RenderDiffTable";
import { stripHtml } from "../utils/helper";

interface DiffResult {
  hotTableComponentDiffResult:
    | React.RefObject<any>
    | React.MutableRefObject<any>;
}

const DiffResultHooks = (props: DiffResult) => {
  const hotDiffResultSettings = {
    minRows: 10,
    minCols: 10,
    minSpareCols: 0,
    minSpareRows: 0,
    colHeaders: false,
    contextMenu: false,
    rowHeaders: false,
    readOnly: true,
    renderAllRows: true,
    licenseKey: "non-commercial-and-evaluation",
  };

  const exportToExcel = () => {
    if (!props.hotTableComponentDiffResult.current) {
      return;
    }

    const hotInstance = props.hotTableComponentDiffResult.current.hotInstance;
    if (!hotInstance) {
      return;
    }
    const data = hotInstance.getData();

    const sanitisedData = data
      .map((rowArray: any[]) =>
        rowArray.map((cell) => {
          if (cell === null || cell === undefined) {
            return "";
          }
          const stripped = stripHtml(cell.toString());
          return stripped === null || stripped === undefined ? "" : stripped;
        })
      )
      .filter((row: any[]) => row.some((cell) => cell !== ""));

    const worksheetData = sanitisedData.length ? sanitisedData : [[""]];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "نتيجة المقارنة");
    XLSX.writeFile(workbook, "comparison-results.xlsx");
  };

  return (
    <>
      <span style={{ fontSize: 24, display: "block", marginBottom: 10 }}>
        نتيجة المقارنة
      </span>
      <Button type="primary" onClick={exportToExcel} style={{ marginBottom: 10 }}>
        تصدير النتائج إلى Excel
      </Button>
      <HotTable
        ref={props.hotTableComponentDiffResult}
        data={[[""]]}
        style={{ width: "100%", padding: 15 }}
        id={"tableresult"}
        settings={hotDiffResultSettings}
        renderer={renderDiff}
        className="diffhandsontable"
        stretchH={"all"}
      />
    </>
  );
};

export default DiffResultHooks;
