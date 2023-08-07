import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import definition from '../testcases/many-features.js'
import { createParse } from '../util.js'

const app = new Hono()

const parsers = {
  valibot: createParse(definition.schema.valibot),
  zod: createParse(definition.schema.zod),
}

app.post('/', async (c) => {
  const payload = await c.req.json()

  const parse = parsers[payload.libName as keyof typeof parsers]
  if (typeof parse !== 'function') {
    throw new Error('Plesse specify valid libName')
  }
  const result = parse(payload.data)
  // const result = midSchema.schema.zod.safeParse(payload)
  return c.text('Parsed result: ' + (result.success ? "success" : "failure"))
})
const port = 8455
serve({ fetch: app.fetch, port })

