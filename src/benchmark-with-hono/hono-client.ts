import { validData, invalidData } from "../testcases/many-features.js"

const run = async () => {
  const res = await fetch('http://localhost:8455', {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      libName: 'valibot',
      data: invalidData
    })
  })

}


const start = performance.now()

const opsPerSecond: number = await (async () => {
  for (let i = 0; ; ++i) {
    await run()
    const elapsedTime = performance.now() - start
    if (elapsedTime > 5000) {
      return Math.floor(i / (elapsedTime / 1000))
    }
  }
})()

console.log(opsPerSecond)
