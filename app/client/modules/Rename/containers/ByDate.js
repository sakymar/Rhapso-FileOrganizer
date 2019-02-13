import React from "react";
import { Button } from "@material-ui/core";
import SelectFormat from "../../../components/SelectFormat";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

const dateOptions = [
  {
    value: 0,
    label: "Decade"
  },
  {
    value: 1,
    label: "Year"
  },
  {
    value: 2,
    label: "Month"
  },
  {
    value: 3,
    label: "Week"
  },
  {
    value: 4,
    label: "Day"
  },
  {
    value: 5,
    label: "Hour"
  }
];

const ByDate = ({
  formatDate,
  handleChangeFormatDate,
  handleRemoveFormatDate,
  changeDestinationFolder,
  handleAddFormatDate,
  destinationFolder
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyConten: "center",
        alignItems: "center",
        marginTop: 20
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={changeDestinationFolder}>Destination Folder</Button>
        {formatDate.map((format, index) => (
          <div>
            <SelectFormat
              value={formatDate[index]}
              onChange={value => handleChangeFormatDate(value, index)}
              style={{
                color: "white",
                minWidth: 150,
                borderBottom: "1px solid white",
                marginLeft: 30,
                fontSize: 16
              }}
              classes={{ icon: { color: "white" } }}
              options={dateOptions.slice(
                formatDate[index - 1],
                dateOptions.length + 1
              )}
            />
            <Button
              variant="fab"
              color="secondary"
              style={{
                width: 30,
                height: 30,
                minHeight: 30,
                minWidth: 30
              }}
              onClick={() => handleRemoveFormatDate(index)}
            >
              <CloseIcon />
            </Button>
            /
          </div>
        ))}
        <Button
          onClick={() =>
            handleAddFormatDate([
              ...formatDate,
              typeof formatDate[formatDate.length - 1] != "undefined"
                ? formatDate[formatDate.length - 1] + 1
                : 0
            ])
          }
          style={{
            width: 30,
            height: 30,
            minHeight: 30,
            minWidth: 30
          }}
          variant="fab"
          color="secondary"
          aria-label="Edit"
        >
          <AddIcon />
        </Button>
      </div>
      <div
        style={{
          marginTop: 10,
          marginBottom: 20,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          fontSize: 12
        }}
      >
        <p>Example : folder/file --> {destinationFolder} </p>
        {formatDate.map(part => (
          <p style={{ fontSize: 12 }}>{dateOptions[part].label}/</p>
        ))}
      </div>
    </div>
  );
};

export default ByDate;
