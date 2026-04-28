import { spawn } from "child_process";

const dev = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  shell: true,
});

setTimeout(() => {
  console.log("🛑 Stopping dev server...");
  dev.kill("SIGINT");
}, 8000); // run for 8 seconds