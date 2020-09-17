const electron = require("electron");
const path = require("path");
const url = require("url");
const ipc = electron.ipcRenderer;
const $ = require("jquery");

//
const lines = $("#lines");
// $("#template").val($("#template").val() + " " + insertText);
lines.append("<span class='line'>1</span>");
const updateLines = (lines_array) => {
  lines.html("");
  lines_array.map((line, index) => {
    lines.append(`<span class='line'>${index + 1}</span>`);
  });
};
const run = $("#run");
const print_ = $("#print");
const clear = $("#clear");
const theme = $("#customSwitches");
const mainEditor = $("#main-editor");
const openFile = $("#openFile");

// implementing the batery API

const batteryFunction = async () => {
  await navigator.getBattery().then((battery) => {
    battery.addEventListener("chargingchange", function () {
      console.log("New charging state: ", battery.charging);
    });
    battery.addEventListener("levelchange", function () {
      console.log("New battery level: ", battery.level * 100 + "%");
    });
    battery.addEventListener("chargingtimechange", function () {
      console.log(
        "New time left until full: ",
        battery.chargingTime,
        " seconds"
      );
    });
    battery.addEventListener("dischargingtimechange", function () {
      console.log(
        "New time left until empty: ",
        battery.dischargingTime,
        " seconds"
      );
    });
  });
};
batteryFunction();

print_.click(() => {
  print();
});
theme.click(() => {
  //   console.log(theme.val());
  //   chang the theme
});

run.on("click", () => {
  const main_text = mainEditor.val();
  eval(main_text);
});

mainEditor.keyup((event) => {
  if (event.charCode === 13 || event.code === "Enter" || event.keyCode === 13) {
    //    update number of lines
    const main_text = mainEditor.val();
    const lines_array = main_text.split("\n");
    updateLines(lines_array);
  } else if (event.code === "Backspace" || event.keyCode === 8) {
    //
    const main_text = mainEditor.val();
    const lines_array = main_text.split("\n");
    updateLines(lines_array);
  }
});

clear.click(() => {
  ipc.send("clear-editor");
  ipc.on("response", (event, args) => {
    if (args.response === 0) {
      mainEditor.val("");
      const main_text = mainEditor.val();
      const lines_array = main_text.split("\n");
      updateLines(lines_array);
    } else {
      //
    }
  });
});
openFile.click(() => {
  ipc.send("open-file");
});
ipc.on("data", (event, args) => {
  mainEditor.val("");
  mainEditor.val(args);
  const main_text = mainEditor.val();
  const lines_array = main_text.split("\n");
  updateLines(lines_array);
});
