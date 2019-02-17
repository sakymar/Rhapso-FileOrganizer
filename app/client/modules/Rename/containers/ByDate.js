import React from "react";
import { Button } from "@material-ui/core";
import SelectFormat from "../../../components/SelectFormat";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";

const ByDateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white !important;
  font-family: Opensans;
  font-size: 14px;

  input {
    color: white !important;
  }

  p {
    font-size: 14px !important;
  }

  .row {
    display: flex;
    flex-direction: row;
    width: 80%;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .rowItem {
    display: flex;
    flex-direction: row;
    width: 30%;
    align-items: center;
  }

  .rowItem p {
    margin-left: 10px;
  }

  .submitButton {
    color: white;
    background-color: #f76d3a;
  }

  .separator {
    width: 50%;
    margin-top: 100px;
    margin-bottom: 20px;
    color: white;
    border-width: 0.5px !important;
  }

  .inputNameFile {
    border-bottom: 1px solid white !important;
  }

  .resultFormat {
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .resultFormat p {
    margin: 0 !important;
    font-size: 12px;
  }
`;

const dateOptions = [
  {
    value: 0,
    label: "Year"
  },
  {
    value: 1,
    label: "Month"
  },
  {
    value: 2,
    label: "Week"
  },
  {
    value: 3,
    label: "Day"
  },
  {
    value: 4,
    label: "Hour"
  }
];

const ByDate = ({
  formatDate,
  handleChangeFormatDate,
  handleRemoveFormatDate,
  changeDestinationFolder,
  handleAddFormatDate,
  sourceFolder,
  destinationFolder
}) => {
  return (
    <ByDateContainer>
      <div className="row">
        <div className="rowItem">
          <Button
            className="submitButton"
            onClick={() => changeDestinationFolder("sourceFolder")}
          >
            Source Folder
          </Button>
          <p>{sourceFolder}</p>
        </div>

        <div className="rowItem">
          <Button
            className="submitButton"
            onClick={() => changeDestinationFolder("destinationFolder")}
          >
            Destination Folder
          </Button>
          <p>{destinationFolder}</p>
        </div>
      </div>
      <div className="row">
        <p>Format : </p>
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
                width: 25,
                height: 25,
                minHeight: 25,
                minWidth: 25
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
            width: 25,
            height: 25,
            minHeight: 25,
            minWidth: 25
          }}
          variant="fab"
          color="secondary"
          aria-label="Edit"
        >
          <AddIcon />
        </Button>
      </div>

      <div className="resultFormat">
        <p>Example : folder/file --> {destinationFolder} </p>
        {formatDate.map(part => (
          <p style={{ fontSize: 12 }}>{dateOptions[part].label}/</p>
        ))}
      </div>
    </ByDateContainer>
  );
};

export default ByDate;
