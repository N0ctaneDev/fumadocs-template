import { spawn } from "child_process";
import kill from "tree-kill";

const dev = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  shell: true,
});

setTimeout(() => {
  console.log("🛑 Killing dev server (entire tree)...");
  kill(dev.pid, "SIGINT");
}, 8000);