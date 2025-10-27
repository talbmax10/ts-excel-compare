import React from "react";
import { HotTable } from "@handsontable/react";
import { renderDiff } from "../utils/RenderDiffTable";
import { stripHtml } from "../utils/helper";

interface DiffResult {
  hotTableComponentDiffResult: React.RefObject<any>;
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

  const exportToCsv = () => {
    const hotInstance = props.hotTableComponentDiffResult.current.hotInstance;
    const data = hotInstance.getData();

    const processRow = (rowArray: any[]) => {
      let row = rowArray.map(cell => {
        let scell = cell === null ? "" : cell.toString();
        scell = stripHtml(scell);
        if (scell.includes(',') || scell.includes('"')) {
          scell = '"' + scell.replace(/"/g, '""') + '"';
        }
        return scell;
      }).join(",");
      return row;
    }

    let csvContent = "\uFEFF"; // Add BOM for Excel
    data.forEach((rowArray: any[]) => {
      csvContent += processRow(rowArray) + "\r\n";
    });

    var encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "comparison.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <span style={{ fontSize: 24 }}>{"比較結果"}</span>
      <button onClick={exportToCsv}>تصدير إلى Excel</button>
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
