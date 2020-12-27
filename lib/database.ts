import router from "next/router"
import * as Types from "types"

import firebase from "./firebase"
import db from "./firestore"

// New

/* 
How the backend works

> Users
--> user
----> Projects
------> project
--------> id
--------> name
--------> lastModified
--------> code
----------> state
----------> view
----------> static
*/

// New Users
export async function addUser(uid: string) {
  const doc = db.collection("users").doc(uid)
  const initial = await doc.get()

  if (initial.exists) {
    console.log("User exists, updating user data")
    if (!initial.data().exists) {
      doc
        .update({ exists: true, dateLastLoggedIn: new Date().toUTCString() })
        .catch((e) => {
          console.log("Error setting user", uid, e.message)
        })
    }
  } else {
    console.log("Creating new user")
    const dateString = new Date().toUTCString()

    doc
      .set({
        id: uid,
        exists: true,
        dateCreated: dateString,
        dateLastLoggedIn: dateString,
      })
      .catch((e) => {
        console.log("Error setting user", uid, e.message)
      })

    doc.collection("projects").add({
      name: "Toggle",
      dateCreated: dateString,
      lastModified: dateString,
      code: {
        state: `export default createState({
  data: {
    count: 0,
  },
  initial: 'off',
  states: {
    off: {
      on: {
        TURNED_ON: {
          to: 'running',
        },
      },
    },
    running: {
      on: {
        TURNED_OFF: {
          to: 'off',
        },
        DECREMENTED: {
          unless: 'atMin',
          do: 'decrement',
        },
        INCREMENTED: {
          unless: 'atMax',
          do: 'increment',
        },
      },
    },
  },
  conditions: {
    atMin(data) {
      return data.count <= 0;
    },
    atMax(data) {
      return data.count >= 10;
    },
  },
  actions: {
    increment(data) {
      data.count++;
    },
    decrement(data) {
      data.count--;
    },
  },
});
`,
        view: `import state from './state';

export default function App() {
  const local = useStateDesigner(state);

  return (
    <Box css={{ textAlign: 'center' }}>
      <h1>{Static.name}</h1>
      <Flex>
        <IconButton
          css={{ bg: '$muted', px: '$3', mx: '$2' }}
          disabled={!state.can('DECREMENTED')}
          onClick={() => state.send('DECREMENTED')}
        >
          <Icons.Minus />
        </IconButton>
        <h2>{local.data.count}</h2>
        <IconButton
          css={{ bg: '$muted', px: '$3', mx: '$2' }}
          disabled={!state.can('INCREMENTED')}
          onClick={() => local.send('INCREMENTED')}
        >
          <Icons.Plus />
        </IconButton>
      </Flex>
    </Box>
  );
}
`,
        static: `export default function getStatic() {
  return {
    name: "Julian",
    age: 93,
    height: 184
  }
}`,
      },
    })
  }
}

// Old

export async function getProjectInfo(
  pid: string,
  oid: string,
  uid?: string,
): Promise<Types.ProjectResponse> {
  const project = await db
    .collection("users")
    .doc(oid)
    .collection("projects")
    .doc(pid)
    .get()

  return {
    oid,
    pid,
    isProject: project.exists,
    isOwner: oid === uid,
  }
}

export async function getProjectData(
  pid: string,
  oid: string,
): Promise<Types.ProjectData> {
  const initial = await db
    .collection("users")
    .doc(oid)
    .collection("projects")
    .doc(pid)
    .get()

  if (initial.exists) {
    const data = initial.data()
    return { ...data, pid, oid: data.ownerId } as Types.ProjectData
  } else {
    return undefined
  }
}

/* ----------------- Project Editing ---------------- */

export function subscribeToDocSnapshot(
  pid: string,
  oid: string,
  callback: (
    doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
  ) => void,
) {
  let unsub: any

  getProject(pid, oid)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("No project with that owner / id!")
      }

      unsub = db
        .collection("users")
        .doc(oid)
        .collection("projects")
        .doc(pid)
        .onSnapshot((doc) => {
          if (!doc.exists) {
            return
          }
          callback(doc)
        })
    })

  return () => unsub && unsub()
}

export function saveProjectStateCode(pid: string, oid: string, code: string) {
  db.collection("users").doc(oid).collection("projects").doc(pid).update({
    code: code,
  })
}

export function saveProjectViewCode(pid: string, oid: string, code: string) {
  db.collection("users").doc(oid).collection("projects").doc(pid).update({
    jsx: code,
  })
}

export function saveProjectStaticCode(pid: string, oid: string, code: string) {
  db.collection("users").doc(oid).collection("projects").doc(pid).update({
    statics: code,
  })
}

export function saveProjectCode(
  pid: string,
  oid: string,
  activeTab: Types.CodeEditorTab,
  code: string,
) {
  db.collection("users")
    .doc(oid)
    .collection("projects")
    .doc(pid)
    .update({
      [`code.${activeTab}`]: code,
    })
}

export function saveProjectName(pid: string, oid: string, name: string) {
  db.collection("users").doc(oid).collection("projects").doc(pid).update({
    name,
  })
}

/* -------------------- Unsorted -------------------- */

export async function getTemplate(pid: string) {
  const doc = await db.collection("templates").doc(pid).get()

  if (doc.exists) {
    return doc.data()
  } else {
    throw Error("Missing template! ID:" + pid)
  }
}

export function getProject(pid: string, oid: string) {
  return db.collection("users").doc(oid).collection("projects").doc(pid)
}

export async function addProject(
  pid: string,
  oid: string,
  template: { [key: string]: any },
) {
  const project = getProject(pid, oid)
  const initial = await project.get()

  if (initial.exists) {
    console.log("That project already exists!")
    return project
  }

  // Overwrite the template's name and owner
  return project.set({
    ...template,
    name: pid,
    owner: oid,
  })
}

export function updateProject(
  pid: string,
  oid: string,
  changes: { [key: string]: any },
) {
  return getProject(pid, oid).update({
    ...changes,
  })
}

export async function createProject(
  pid: string,
  uid: string,
  templateId = "toggle",
) {
  const template = await db.collection("templates").doc(templateId).get()
  return await addProject(pid, uid, template.data())
}

export async function updateProjectCode(
  pid: string,
  oid: string,
  uid: string,
  code: string,
) {
  // must be owner
  if (uid === oid) {
    return updateProject(pid, oid, {
      code,
    })
  }
}

export async function createNewProject(pid: string, oid: string, uid: string) {
  await createProject(pid, uid, "toggle")
  router.push(`/${uid}/${pid}`)
}

export async function forkProject(pid: string, oid: string, uid?: string) {
  const project = await getProject(pid, oid).get()

  if (!project.exists) {
    console.log("That project doesn't exist!")
    return
  }

  const data = project.data()

  let doc = db.collection("users").doc(uid).collection("projects").doc(pid)

  let initial = await doc.get()

  let i = 0
  let id = pid
  let exists = initial.exists

  while (exists) {
    i++
    id = `${pid}_copy_${i}`

    doc = db.collection("users").doc(uid).collection("projects").doc(id)
    initial = await doc.get()
    exists = initial.exists
  }

  await doc.set({
    ...data,
    owner: uid,
  })

  router.push(`/u/${uid}/p/${id}`)
}

export async function getUserProjects(uid: string, oid: string) {
  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("projects")
    .get()

  const projects = snapshot.docs.map((doc) => doc.id)

  return {
    uid,
    oid,
    projects,
    isOwner: uid === oid,
  }
}

export async function getUserProjectById(uid: string, pid: string) {
  const project = await db
    .collection("users")
    .doc(uid)
    .collection("projects")
    .doc(pid)
    .get()

  return project
}

export async function isProjectNameValid(
  pid: string,
  uid: string,
  name: string,
) {
  return true
}

export async function updateProjectName(
  pid: string,
  uid: string,
  name: string,
) {
  updateProject(pid, uid, { name })
}
