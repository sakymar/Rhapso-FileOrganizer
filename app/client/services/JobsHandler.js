import schedule from "node-schedule";
import storage from "electron-settings";
import actions from "../actions";
import chokidar from "chokidar";
import moment from "moment";

class JobsHandler {
  constructor() {
    this.jobs = {};
    this.observers = {};

    const rules = storage.get("rules");
    let nbRuleMissed = 0;
    console.log("RULES ON HANDLER", rules);
    Object.values(rules).forEach(rule => {
      console.log("RULE ,,", rule);
      if (rule.active && rule.planOnce) {
        if (rule.planOnce < Date.now()) {
          nbRuleMissed += 1;
        } else {
          if (rule.confirm) {
            this.addJob({
              id: rule.id,
              temporality: rule.planOnce,
              action: () => {
                new Notification("Rhapso - Create List", {
                  body: "Hey confirm the action"
                });

                rule.active = false;
                rule.waitingForConfirm = true;
                storage.set("rules", { ...rules, [rule.id]: rule });
              }
            });
          } else {
            this.addJob({
              id: rule.id,
              temporality: rule.planOnce,
              action: () => {
                actions[rule.action][rule.type](rule);

                rule.active = false;
                storage.set("rules", { ...rules, [rule.id]: rule });
              }
            });
          }
        }
      }
      if (rule.active && rule.cron) {
        if (rule.confirm) {
          this.addJob({
            id: rule.id,
            temporality: rule.cron,
            action: () => {
              new Notification("Rhapso - Create List", {
                body: "Hey confirm the action"
              });
              rule.waitingForConfirm = true;
              storage.set("rules", { ...rules, [rule.id]: rule });
              this.setState({ rules: { ...rules, [rule.id]: rule } });
              actions[rule.action][rule.type](rule);
            }
          });
        } else {
          this.addJob({
            id: rule.id,
            temporality: rule.cron,
            action: () => {
              actions[rule.action][rule.type](rule);
            }
          });
        }
      }
      if (rule.active && rule.watch) {
        console.log("ACTIVE DE REGLE WATCH");
        this.addObserver({
          path: rule.watch,
          depth: rule.recursive,
          action: () => {
            console.log("PASSAGE ACTION EN EFFET");
            if (rule.confirm) {
              console.log("PASSAGE CONFIRM YH");

              new Notification("Rhapso - Create List", {
                body: "Hey confirm the action"
              });
              rule.waitingForConfirm = true;
              storage.set("rules", { ...rules, [rule.id]: rule });
              this.setState({ rules: { ...rules, [rule.id]: rule } });
            } else {
              actions[rule.action][rule.type](rule);
            }
          }
        });
      }
    });
    if (nbRuleMissed) {
      new Notification("Rhapso - Create List", {
        body: `U missed ${nbRuleMissed} planified rules, check the rule panel to confirm them`
      });
    }
    console.log("APRES LES RULES");
  }

  removeJob = id => {
    jobs[id].cancel();
    delete this.jobs[id];
  };

  removeObserver = id => {
    observers[id].close();
    delete this.observers[id];
  };

  addJob = ({ id, action, temporality }) => {
    this.jobs[id] = schedule.scheduleJob(temporality, () => action());
  };

  addObserver = ({ id, action, path, depth }) => {
    this.observers[id] = chokidar.watch(path, {
      ignored: /(^|[\/\\])\../,
      ignoreInitial: true,
      persistent: true,
      depth: depth ? 1 : undefined
    });
    this.observers[id]
      .on("add", action)
      .on("change", action)
      .on("unlink", action);
    console.log("PASSAGE OBSERVER", this.observers[id]);
  };
}

let jobsHandler = new JobsHandler();
export default jobsHandler;
