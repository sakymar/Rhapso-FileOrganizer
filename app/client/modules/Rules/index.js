import React, { Component } from "react";
import styled from "styled-components";
import storage from "electron-settings";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Close from "@material-ui/icons/CloseOutlined";
import PlayArrow from "@material-ui/icons/PlayArrowOutlined";
import {
  Fab,
  Dialog,
  Slide,
  MenuItem,
  Select,
  Switch
} from "@material-ui/core";
import Button from "../../components/Button";
import { remote } from "electron";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from "@material-ui/pickers";
import CronBuilder from "react-cron-builder";
import "react-cron-builder/dist/bundle.css";
import actions from "../../actions";
import chokidar from "chokidar";
import schedule from "node-schedule";

const RulesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 50px;
  overflow-y: auto;

  .card {
    background-color: orange;
    border: 2px solid black;
    color: white;
    padding: 10px;
    min-height: 150px;
    max-height: 70vh;
  }
`;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Rules extends Component {
  constructor(props) {
    super(props);
    this.state = { rules: {}, planOnce: { date: new Date() } };
  }

  updateActive(id) {
    const { rules } = this.state;
    const rule = Object.values(rules).find(item => item.id === id);
    rule.active = !rule.active;
    storage.set("rules", { ...rules, [rule.id]: rule });
    this.setState({ rules: { ...rules, [rule.id]: rule } });
  }

  setConfirm(id) {
    const { rules } = this.state;
    const rule = Object.values(rules).find(item => item.id === id);
    rule.confirm = !rule.confirm;
    storage.set("rules", { ...rules, [rule.id]: rule });
    this.setState({ rules: { ...rules, [rule.id]: rule } });
  }

  setFolders(id) {
    const { rules } = this.state;
    let paths = remote.dialog.showOpenDialog({
      properties: ["openDirectory", "multiSelections"]
    });

    const rule = Object.values(rules).find(item => item.id === id);
    rule.sourceFolders = paths ? paths : [];
    storage.set("rules", { ...rules, [rule.id]: rule });
    this.setState({ rules: { ...rules, [rule.id]: rule } });
  }

  deleteRule(id) {
    const { rules } = this.state;
    storage.set("rules", rules.filter(item => item.id != id));
    this.setState({ rules: rules.filter(item => item.id != id) });
  }

  componentDidMount() {
    let rules = storage.get("rules");
    this.setState({ rules });
  }

  confirmPlanOnce() {
    const { planOnce, openedRule } = this.state;
    console.log("PLAN ONCE", this.state);

    const hours = planOnce.time.getHours();
    const minutes = planOnce.time.getMinutes();
    const finalDate = planOnce.date.setHours(hours, minutes, 0);
    if (openedRule.confirm) {
      const { rules } = this.state;
      const rule = Object.values(rules).find(item => item.id === openedRule.id);
      schedule.scheduleJob(finalDate, () => {
        new Notification("Rhapso - Create List", {
          body: "Hey confirm the action"
        });
        rule.waitingForConfirm = true;
        rule.active = false;
        storage.set("rules", { ...rules, [rule.id]: rule });
        this.setState({ rules: { ...rules, [rule.id]: rule } });
      });

      rule.active = true;
      rule.planOnce = true;
      storage.set("rules", { ...rules, [rule.id]: rule });
      this.setState({ rules: { ...rules, [rule.id]: rule } });
    } else {
      schedule.scheduleJob(finalDate, () => {
        actions[openedRule.action][openedRule.type](openedRule);
      });
    }
  }

  confirmWatch() {
    const { openedRule, rules } = this.state;
    const rule = Object.values(rules).find(item => item.id === openedRule.id);

    const watcher = chokidar.watch("/Users/antoinemesnil/Perso/loryne", {
      ignored: /(^|[\/\\])\../,
      ignoreInitial: true,
      persistent: true
    });
    watcher
      .on("add", path =>
        openedRule.confirm
          ? this.setConfirmation()
          : schedule.scheduleJob(finalDate, () => {
              actions[openedRule.action][openedRule.type](openedRule);
            })
      )
      .on("change", function(path) {
        console.log("File", path, "has been changed");
      })
      .on("unlink", function(path) {
        console.log("File", path, "has been removed");
      })
      .on("error", function(error) {
        console.error("Error happened", error);
      });
    rule.active = true;
    rule.watcher = true;

    storage.set("rules", { ...rules, [rule.id]: rule });
    this.setState({ rules: { ...rules, [rule.id]: rule } });
  }

  setConfirmation() {
    const { openedRule, rules } = this.state;
    const rule = Object.values(rules).find(item => item.id === openedRule.id);
    new Notification("Rhapso - Create List", {
      body: "Hey confirm the action"
    });
    rule.waitingForConfirm = true;
    rule.active = false;
    storage.set("rules", { ...rules, [rule.id]: rule });
    this.setState({ rules: { ...rules, [rule.id]: rule } });
  }

  handleConfirmExecution(openedRule) {
    const { rules } = this.state;
    const rule = Object.values(rules).find(item => item.id === openedRule.id);

    rule.waitingForConfirm = false;
    rule.active = rule.planOnce ? false : true;
    storage.set("rules", { ...rules, [rule.id]: rule });
    this.setState({ rules: { ...rules, [rule.id]: rule } });
    actions[openedRule.action][openedRule.type](openedRule);
  }

  render() {
    let { rules, open, typePlan, planOnce = {}, cron = null } = this.state;
    if (!rules) {
      rules = {};
    }

    console.log("RULES", rules);
    console.log("ACTIONS", actions);
    return (
      <RulesContainer className="containerScreen">
        {Object.values(rules).map(item => (
          <div className="card">
            {console.log(
              "RULE FUNCTION",
              item.action,
              item.type,
              actions[item.action],
              actions[item.action][item.type]
            )}
            <p>{item.name || "Nom regle"}</p>
            <p>{item.type}</p>
            <p>{item.action}</p>

            <Button onClick={() => this.setFolders(item.id)}>
              Source folders
            </Button>
            <Button
              onClick={() => this.setState({ open: true, openedRule: item })}
            >
              Planifier activation
            </Button>
            <div>
              <p>Execute action only after confirm </p>
              <Switch
                checked={item.confirm}
                style={{ color: "white" }}
                onClick={() => this.setConfirm(item.id)}
              />
            </div>

            <Fab
              onClick={() => this.updateActive(item.id)}
              color={item.active ? "primary" : ""}
              aria-label="add"
            >
              <CheckCircleOutline />
            </Fab>
            <Fab onClick={() => this.deleteRule(item.id)} aria-label="add">
              <DeleteOutline />
            </Fab>
            <Fab
              onClick={() => actions[item.action][item.type](item)}
              color="secondary"
              aria-label="add"
            >
              <PlayArrow />
            </Fab>
            {item.waitingForConfirm && (
              <Button onClick={() => this.handleConfirmExecution(item)}>
                Confirm execution
              </Button>
            )}
          </div>
        ))}
        <Dialog
          style={{
            width: "80%",
            height: "80%",
            marginTop: "10%",
            marginLeft: "10%",
            border: "4px",
            display: "flex",
            flexDirection: "column"
          }}
          fullScreen
          open={open}
          onClose={() => this.setState({ open: false })}
          TransitionComponent={Transition}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "10px"
            }}
          >
            <Fab color="secondary" aria-label="add">
              <Close onClick={() => this.setState({ open: false })} />
            </Fab>
            <Select
              value={typePlan}
              onChange={event =>
                this.setState({ typePlan: event.target.value })
              }
              inputProps={{
                name: "age",
                id: "age-simple"
              }}
            >
              <MenuItem value={"plan"}>Plan to execute once</MenuItem>
              <MenuItem value={"cron"}>Plan to execute reccurently</MenuItem>
              <MenuItem value={"watch"}>
                Watch the folder and execute immediatly
              </MenuItem>
            </Select>
            {typePlan === "plan" && (
              <React.Fragment>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date picker inline"
                    value={planOnce.date}
                    onChange={date =>
                      this.setState({
                        planOnceDate: { ...this.state.planOnce, date }
                      })
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date"
                    }}
                  />
                  <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="Time picker"
                    value={planOnce.time}
                    onChange={time =>
                      this.setState({
                        planOnce: { ...this.state.planOnce, time }
                      })
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change time"
                    }}
                  />
                </MuiPickersUtilsProvider>

                <Button
                  onClick={() => this.confirmPlanOnce()}
                  styles={`margin-top: auto, width: 200px`}
                >
                  Confirm
                </Button>
              </React.Fragment>
            )}
            {typePlan === "cron" && (
              <CronBuilder
                cronExpression="*/4 2,12,22 * * 1-5"
                onChange={value => console.log(value)}
                showResult={false}
              />
            )}
            {typePlan === "watch" && (
              <Button
                onClick={() => this.confirmWatch()}
                styles={`margin-top: auto, width: 200px`}
              >
                Confirm
              </Button>
            )}
          </div>
        </Dialog>
      </RulesContainer>
    );
  }
}

export default Rules;
