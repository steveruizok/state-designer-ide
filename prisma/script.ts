import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// A `main` function so that you can use async/await
async function main() {
  // const allUsers = await prisma.user.create({
  //   data: {
  //     email: "steveruizok@gmail.com",
  //     name: "Steve",
  //   },
  // })

  await prisma.project.create({
    data: {
      owner: { connect: { id: 1 } },
      name: "New Project",
      stateCode: `export default createState({\n\tdata: {\n\t\tcount: 0,\n\t},\n\tinitial: 'turnedOff',\n\tstates: {\n\t\tturnedOff: {\n\t\t\ton: {\n\t\t\t\tTOGGLED: {\n\t\t\t\t\tto: 'turnedOn',\n\t\t\t\t},\n\t\t\t},\n\t\t},\n\t\tturnedOn: {\n\t\t\ton: {\n\t\t\t\tTOGGLED: {\n\t\t\t\t\tto: 'turnedOff',\n\t\t\t\t},\n\t\t\t\tDECREMENTED: {\n\t\t\t\t\tunless: 'atMin',\n\t\t\t\t\tdo: 'decrement',\n\t\t\t\t},\n\t\t\t\tINCREMENTED: {\n\t\t\t\t\tunless: 'atMax',\n\t\t\t\t\tdo: 'increment',\n\t\t\t\t},\n\t\t\t},\n\t\t},\n\t},\n\tconditions: {\n\t\tatMin(data) {\n\t\t\treturn data.count <= 0;\n\t\t},\n\t\tatMax(data) {\n\t\t\treturn data.count >= 10;\n\t\t},\n\t},\n\tactions: {\n\t\tincrement(data) {\n\t\t\tdata.count++;\n\t\t},\n\t\tdecrement(data) {\n\t\t\tdata.count--;\n\t\t},\n\t},\n});"`,
      viewCode: `import state from './state';\n\nexport default function App() {\n  const local = useStateDesigner(state);\n\n  return (\n    <Grid css={{ bg: '$border', textAlign: 'center' }}>\n      <Text>Hello {Static.name}</Text>\n      <Flex>\n        <IconButton\n          disabled={!state.can('DECREMENTED')}\n          onClick={() => state.send('DECREMENTED')}\n        >\n          <Icons.Minus />\n        </IconButton>\n        <Heading css={{ p: '$3' }}>{local.data.count}</Heading>\n        <IconButton\n          disabled={!state.can('INCREMENTED')}\n          onClick={() => local.send('INCREMENTED')}\n        >\n          <Icons.Plus />\n        </IconButton>\n      </Flex>\n      <Button onClick={() => state.send('TOGGLED')}>\n        {local.whenIn({\n          turnedOff: 'Turn On',\n          turnedOn: 'Turn Off',\n        })}\n      </Button>\n    </Grid>\n  );\n}\n"`,
      staticCode: `export default function getStatic() {\n  return {\n    name: 'Kitoko',\n    age: 93,\n    height: 184,\n  };\n}\n"`,
    },
  })

  // ... you will write your Prisma Client queries here
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
