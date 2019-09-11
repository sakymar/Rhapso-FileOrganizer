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
  TextField
} from "@material-ui/core";
import Button from "../../../components/Button";
import readdirp from "readdirp";
import { remote } from "electron";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteFiles } from "../helpers";

const SizeContainer = styled.div`
  .listContainer {
    overflow-y: auto;
    width: 80%;
    max-height: 50vh;
  }

  .unitSize {
    padding: 15px;
    background-color: grey;
    color: white;
  }

  .unitSize:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  .activeUnitSize {
    background-color: orange;
  }
`;

class Size extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allFiles: [],
      selectedFiles: [],
      checkedSizes: {},
      unitSize: "Ko",
      compareSize: true
    };
  }

  handleChangeCheckbox = (name, event) => {
    const { allFiles } = this.state;
    const checkedSizes = event.target.checked
      ? [...this.state.checkedSizes, name]
      : this.state.checkedSizes.filter(item => item !== name);

    this.setState({
      checkedSizes,
      selectedFiles: allFiles.filter(item => checkedSizes.includes(item.size))
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
    const UNIT_TO_SIZE = {
      Ko: 1000,
      Mo: 1000000,
      Go: 1000000000
    };

    const { size, unitSize, compareSize, allFiles } = this.state;
    return allFiles.filter(item =>
      compareSize
        ? item.stats.size > size * UNIT_TO_SIZE[unitSize]
        : item.stats.size < size * UNIT_TO_SIZE[unitSize]
    );
  }

  render() {
    const { size, unitSize, compareSize, recursive } = this.state;

    const selectedFiles = this.filterFiles();

    return (
      <SizeContainer>
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
          <p>Inférieure</p>
          <Switch
            checked={compareSize}
            onChange={event =>
              this.setState({ compareSize: event.target.checked })
            }
            value="checkedA"
          />
          <p>Supérieure</p>
          <p style={{ marginLeft: "20px", marginRight: "20px" }}> à </p>
          <TextField
            id="outlined-number"
            label="Number"
            value={size}
            onChange={event => this.setState({ size: event.target.value })}
            type="number"
            InputLabelProps={{
              shrink: true
            }}
            style={{ color: "white" }}
            margin="normal"
            variant="outlined"
          />
          <div
            onClick={() => this.setState({ unitSize: "Ko" })}
            className={`unitSize ${unitSize === "Ko" && "activeUnitSize"}`}
          >
            Ko
          </div>
          <div
            onClick={() => this.setState({ unitSize: "Mo" })}
            className={`unitSize ${unitSize === "Mo" && "activeUnitSize"}`}
          >
            Mo
          </div>
          <div
            onClick={() => this.setState({ unitSize: "Go" })}
            className={`unitSize ${unitSize === "Go" && "activeUnitSize"}`}
          >
            Go
          </div>
        </div>
        {selectedFiles.length ? (
          <div className="listContainer">
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
                checkedSizes: {}
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
                checkedSizes: []
              });
            }}
          >
            Confirm
          </Button>
        </React.Fragment>
      </SizeContainer>
    );
  }
}

export default Size;
