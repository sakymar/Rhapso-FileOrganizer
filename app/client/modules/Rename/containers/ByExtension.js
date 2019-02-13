import React from "react";
import { Checkbox, Button } from "@material-ui/core";
import { renameByExtensions } from "../actions";

const ByExtension = ({
  recursive,
  extensions,
  changeDestinationFolder,
  onChangeRecursive,
  sourceFolder
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Checkbox checked={recursive} onChange={onChangeRecursive} />
        <p>Include sub-directories</p>
      </div>
      <Button
        style={{ color: "white", backgroundColor: "red" }}
        onClick={changeDestinationFolder}
      >
        Destination Folder
      </Button>
      <Button
        style={{ color: "white", backgroundColor: "red" }}
        onClick={() => renameByExtensions(sourceFolder)}
      >
        Ok
      </Button>
    </div>
  );
};

export default ByExtension;
