import { getQuickJS } from "quickjs-emscripten";

import "../../dist/main.js";

const QuickJS = await getQuickJS();
const vm = QuickJS.newContext();

const world = vm.newString("world");
vm.setProp(vm.global, "NAME", world);
world.dispose();

const result = vm.evalCode(`"Hello " + NAME + "!"`);
if (result.error) {
  console.log("Execution failed:", vm.dump(result.error));
  result.error.dispose();
} else {
  console.log("Success:", vm.dump(result.value));
  result.value.dispose();
}

vm.dispose();
