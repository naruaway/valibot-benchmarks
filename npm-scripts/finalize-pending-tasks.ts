import { cleanUpTaskInput, getTaskInput } from "../src/task-system";

const taskInput = getTaskInput();
if (!taskInput) {
  console.log("there was no pending tasks");
} else {
  cleanUpTaskInput(taskInput);
}
