const cp = require("child_process");
const axios = require("axios");

const installDeps = (version) => {
  console.log("Got electron version", version);

  console.log(`${"\033[90m"}$ electron-rebuild -w sqlite3 -p -v ${version}${"\033[m"}`);

  const rebuild = cp.spawn("./node_modules/.bin/electron-rebuild", ["-w", "sqlite3", "-p", "-v", version]);

  rebuild.stdout.on("data", (d) => console.log(d.toString()));
  rebuild.stderr.on("data", (d) => console.error(d.toString()));
};

if (process.argv.length > 2) {
  installDeps(process.argv[2]);
} else {
  cp.exec("code -v", async (err, stdout, stderr) => {
    try {
      if (err) {
        throw err;
      }

      const codeVersion = stdout.split("\n")[0];

      const res = await axios.get(`https://raw.githubusercontent.com/microsoft/vscode/${codeVersion}/package.json`);

      const electronVersion = res.data.devDependencies.electron;

      if (electronVersion) {
        installDeps(electronVersion);
      } else {
        throw new Error("Couldn't resolve electron version from github.");
      }

      if (stderr) {
        console.error(stderr);
      }
    } catch (error) {
      console.error(error);

      console.log("Failed to get electron version of vscode. Manually find out the electron version and run this command with it.");
    }
  });
}
