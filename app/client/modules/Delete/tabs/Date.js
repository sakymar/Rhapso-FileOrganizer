import React, { Component } from "react";
import styled from "styled-components";
import {
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  TextField,
  Select,
  MenuItem
} from "@material-ui/core";
import Button from "../../../components/Button";
import readdirp from "readdirp";
import { remote } from "electron";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteFiles } from "../helpers";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

const DateContainer = styled.div`
  .listContainer {
    overflow-y: auto;
    width: 80%;
    max-height: 50vh;
  }

  .unitDate {
    padding: 15px;
    background-color: grey;
    color: white;
  }

  .unitDate:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  .activeUnitDate {
    background-color: orange;
  }
`;

class DateTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allFiles: [],
      selectedFiles: [],
      selectedDate: new Date(),
      betweenDate: new Date()
    };
  }

  handleChangeCheckbox = (name, event) => {
    const { allFiles } = this.state;
    const checkedDates = event.target.checked
      ? [...this.state.checkedDates, name]
      : this.state.checkedDates.filter(item => item !== name);

    this.setState({
      checkedDates,
      selectedFiles: allFiles.filter(item => checkedDates.includes(item.size))
    });
  };

  handleOpenFolders() {
    const paths = remote.dialog.showOpenDialog({
      properties: ["openDirectory", "multiSelections"]
    });
    this.handlePathFiles(paths);
  }

  async handlePathFiles(paths) {
    let allData = [];
    const { recursive } = this.state;
    for (let pathFolder of paths) {
      const options = {};
      if (!recursive) {
        options.depth = 0;
      }
      const entries = await readdirp.promise(pathFolder, options);
      console.log("ENTRIES", entries);
      allData = [...allData, ...entries];
    }
    this.setState({
      allFiles: allData,
      selectedFiles: allData
    });
  }

  filterFiles() {
    const { selectedDate, typeAction, betweenDate, allFiles } = this.state;
    console.log("TYPE ACTION", typeAction);
    console.log("ALL FILES", allFiles);
    if (typeAction === "before") {
      return allFiles.filter(item => {
        console.log(
          item.stats.mtime,
          selectedDate,
          item.stats.mtime < selectedDate
        );
        return item.stats.mtime < selectedDate;
      });
    }
    if (typeAction === "after") {
      return allFiles.filter(item => item.stats.mtime > selectedDate);
    }
    if (typeAction === "between") {
      return allFiles.filter(
        item =>
          item.stats.mtime < selectedDate && item.stats.mtime > betweenDate
      );
    }
  }

  render() {
    const { selectedDate, typeAction, betweenDate, recursive } = this.state;

    let selectedFiles = this.filterFiles();
    if (!selectedFiles) {
      selectedFiles = [];
    }

    return (
      <DateContainer>
        <FormControlLabel
          control={
            <Switch
              checked={recursive}
              onChange={event =>
                this.setState({ recursive: event.target.checked })
              }
              value="checkedA"
            />
          }
          label="Recursive"
        />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Select
            value={typeAction}
            onChange={event =>
              this.setState({ typeAction: event.target.value })
            }
            inputProps={{
              name: "age",
              id: "age-simple"
            }}
          >
            <MenuItem value={"before"}>Before</MenuItem>
            <MenuItem value={"after"}>After</MenuItem>
            <MenuItem value="between">Between</MenuItem>
          </Select>
          <p style={{ marginLeft: "20px", marginRight: "20px" }}> à </p>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={selectedDate}
              onChange={date => this.setState({ selectedDate: date })}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>
          {typeAction === "between" && (
            <React.Fragment>
              <p style={{ marginLeft: "20px", marginRight: "20px" }}> et </p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  value={betweenDate}
                  onChange={date => this.setState({ betweenDate: date })}
                  KeyboardButtonProps={{
                    "aria-label": "change date"
                  }}
                />
              </MuiPickersUtilsProvider>
            </React.Fragment>
          )}
        </div>
        {selectedFiles.length ? (
          <div classDate="listContainer">
            <List
              style={{
                backgroundColor: "white",
                borderRadius: "2px",
                paddingBottom: "0px",
                marginBottom: "0px"
              }}
            >
              {selectedFiles.map(file => (
                <ListItem
                  key={file.id}
                  style={{
                    borderBottom: "1px solid black"
                  }}
                >
                  <ListItemText
                    style={{ color: "black" }}
                    primary={file.basename}
                    secondary={file.fullPath}
                  />
                  {/* <ListItemSecondaryAction>
                    <IconButton
                      onClick={() =>
                        this.setState({
                          selectedFiles: selectedFiles.filter(
                            item => item.basename != file.basename
                          )
                        })
                      }
                      aria-label="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction> */}
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          <div
            onClick={() => this.handleOpenFolders()}
            onDrop={e => {
              e.preventDefault();
              e.stopPropagation();
              this.handlePathFiles(
                Object.values(e.dataTransfer.files).map(item => item.path)
              );
            }}
            onDragOver={e => {
              e.stopPropagation();
              e.preventDefault();
              console.log("DRAGOVER", e);
            }}
            style={{
              width: "100%",
              height: "20vh",
              border: "5px solid red",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <p>drop folders mate</p>
          </div>
        )}

        <React.Fragment>
          <Button
            onClick={() =>
              this.setState({
                allFiles: [],
                selectedFiles: [],
                checkedDates: {}
              })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteFiles(selectedFiles.map(item => item.fullPath));
              this.setState({
                selectedFiles: [],
                allFiles: [],
                checkedDates: []
              });
            }}
          >
            Confirm
          </Button>
        </React.Fragment>
      </DateContainer>
    );
  }
}

export default DateTab;
