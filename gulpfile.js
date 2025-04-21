function defaultTask(cb) {
  // place code for your default task here

  console.log("Default task running...");
  cb();
}

exports.default = defaultTask;
