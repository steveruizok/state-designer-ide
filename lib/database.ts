import pick from "lodash/pick"
import router from "next/router"
import * as Types from "types"

import firebase from "./firebase"
import db from "./firestore"
import { ui } from "./local-data"

// New

/* 
Database structure

users: collection
  user: document
    id: string
    exists: boolean
    dateCreated: string
    dateLastLoggedIn: string
    projects: collection
      project: document
        id: string
        name: string
        ownerId: string
        dateCreated: string
        lastModified: string
        payloads: {
          [eventName]: string
        }
        code: {
          state: string
          view: string
          static: string
        }
*/

let customToken: string

export async function setCustomToken(token: string) {
  console.log("setting custom token")
  customToken = token
}

export async function checkAuth() {
  const { currentUser } = db.app.auth()

  if (!currentUser) {
    if (!customToken) {
      console.error("No custom token set!")
    }

    await db.app
      .auth()
      .signInWithCustomToken(customToken)
      .catch(async () => {
        console.log("Could not use the current token, time to make a new one.")
        var path = "/api/refresh"
        var url = process.env.NEXT_PUBLIC_BASE_API_URL + path
        const results = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((d) => d.json())
        customToken = results.customToken
      })
    return checkAuth()
  } else {
    return currentUser
  }
}

export function subscribeToUserAuth(callback: (user: Types.User) => void) {
  checkAuth()
  return db.app.auth().onAuthStateChanged((res) => {
    if (!res) return

    callback({
      name: res.displayName,
      email: res.email,
      uid: res.uid,
      picture: res.photoURL,
    })
  })
}

// New Users

export function getNewProject(
  uid: string,
  dateString: string,
  name = "Toggle",
) {
  return {
    name,
    dateCreated: dateString,
    lastModified: dateString,
    ownerId: uid,
    payloads: {
      TOGGLED: "",
      DECREMENTED: "",
      INCREMENTED: "",
    },
    code: {
      state: `export default createState({
	data: {
		count: 0,
	},
	initial: 'turnedOff',
	states: {
		turnedOff: {
			on: {
				TOGGLED: {
					to: 'turnedOn',
				},
			},
		},
		turnedOn: {
			on: {
				TOGGLED: {
					to: 'turnedOff',
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
    <Grid css={{ bg: '$border', textAlign: 'center' }}>
      <Text>Hello {Static.name}</Text>
      <Flex>
        <IconButton
          disabled={!state.can('DECREMENTED')}
          onClick={() => state.send('DECREMENTED')}
        >
          <Icons.Minus />
        </IconButton>
        <Heading css={{ p: '$3' }}>{local.data.count}</Heading>
        <IconButton
          disabled={!state.can('INCREMENTED')}
          onClick={() => local.send('INCREMENTED')}
        >
          <Icons.Plus />
        </IconButton>
      </Flex>
      <Button onClick={() => state.send('TOGGLED')}>
        {local.whenIn({
          turnedOff: 'Turn On',
          turnedOn: 'Turn Off',
        })}
      </Button>
    </Grid>
  );
}
`,
      static: `export default function getStatic() {
  return {
    name: 'Kitoko',
    age: 93,
    height: 184,
  };
}
`,
    },
  }
}

export async function addUser(uid: string) {
  const doc = db.collection("users").doc(uid)
  const initial = await doc.get()

  if (initial.exists) {
    if (!initial.data().exists) {
      await doc
        .update({ exists: true, dateLastLoggedIn: new Date().toUTCString() })
        .catch((e) => {
          console.log("Error setting user", uid, e.message)
        })
    }
  } else {
    const dateString = new Date().toUTCString()

    await doc
      .set({
        id: uid,
        exists: true,
        dateCreated: dateString,
        dateLastLoggedIn: dateString,
      })
      .catch((e) => {
        console.log("Error setting user", uid, e.message)
      })

    await doc.collection("projects").add(getNewProject(uid, dateString))
  }
}

/* ------------------- Users Page ------------------- */

export async function getUserProjects(oid: string, uid: string) {
  const snapshot = await db
    .collection("users")
    .doc(oid)
    .collection("projects")
    .get()

  const projects = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Types.ProjectData),
  )

  return {
    oid,
    projects,
    isOwner: uid === oid,
  }
}

export async function subscribeToProjects(
  uid: string,
  oid: string,
  callback: (projects: Types.ProjectData[]) => void,
) {
  const ref = db.collection("users").doc(oid).collection("projects")

  return ref.onSnapshot((snapshot) => {
    callback(
      snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Types.ProjectData),
      ),
    )
  })
}

/* ------ Used by server while loading project ------ */

export async function getProjectExists(
  pid: string,
  oid: string,
  uid?: string,
): Promise<{ isProject: boolean }> {
  const project = await db
    .collection("users")
    .doc(oid)
    .collection("projects")
    .doc(pid)
    .get()

  return {
    isProject: project.exists,
  }
}

export async function getProjectData(
  pid: string,
  oid: string,
): Promise<Types.ProjectData> {
  const doc = await db
    .collection("users")
    .doc(oid)
    .collection("projects")
    .doc(pid)
    .get()

  if (doc.exists) {
    return { id: doc.id, ...doc.data() } as Types.ProjectData
  } else {
    return undefined
  }
}

/* ----------------- Project Editing ---------------- */

export async function subscribeToProject(
  pid: string,
  oid: string,
  callback: (doc: Types.ProjectData) => void,
) {
  const docRef = db.collection("users").doc(oid).collection("projects").doc(pid)
  const doc = await docRef.get()

  const exists = doc.exists
  if (!exists) return

  return docRef.onSnapshot((doc) =>
    callback({ id: doc.id, ...doc.data() } as Types.ProjectData),
  )
}

export async function saveProjectCode(
  pid: string,
  oid: string,
  activeTab: Types.CodeEditorTab,
  code: string,
) {
  const user = await checkAuth()

  if (!user) {
    console.log("User is not logged in!")
    return
  }

  return db
    .collection("users")
    .doc(oid)
    .collection("projects")
    .doc(pid)
    .update({
      [`code.${activeTab}`]: code,
      payloads: ui.payloads,
      lastModified: new Date().toUTCString(),
    })
}

export async function savePayloads(
  pid: string,
  oid: string,
  payloads: Record<string, string>,
) {
  const user = await checkAuth()

  if (!user) {
    console.log("User is not logged in!")
    return
  }

  return db
    .collection("users")
    .doc(oid)
    .collection("projects")
    .doc(pid)
    .update({
      payloads,
      lastModified: new Date().toUTCString(),
    })
}

export async function saveProjectName(pid: string, oid: string, name: string) {
  const user = await checkAuth()
  return db
    .collection("users")
    .doc(oid)
    .collection("projects")
    .doc(pid)
    .update({
      name,
      lastModified: new Date().toUTCString(),
    })
}

export async function deleteProject(pid: string) {
  const user = await checkAuth()

  if (!user) {
    console.log("User is not logged in!")
    return
  }

  await db
    .collection("users")
    .doc(user.uid)
    .collection("projects")
    .doc(pid)
    .delete()
}

export async function duplicateProject(
  pid: string,
  oid: string,
  newName?: string,
) {
  const user = await checkAuth()

  const project = await db
    .collection("users")
    .doc(oid)
    .collection("projects")
    .doc(pid)
    .get()

  const dateString = new Date().toUTCString()

  if (!user) {
    console.log("User is not logged in!")
    return
  }

  if (!project.exists) {
    console.log("That project does not exist!")
    return
  }

  const data = project.data()

  const docRef = await db
    .collection("users")
    .doc(user.uid)
    .collection("projects")
    .add({
      ...data,
      dateCreated: dateString,
      lastModified: dateString,
      owner: user.uid,
      name: newName || data.name,
    })

  return getProjectData(docRef.id, user.uid)
}

export async function duplicateProjectAndPush(
  pid: string,
  oid: string,
  name?: string,
) {
  const project = await duplicateProject(pid, oid, name)

  if (!project) {
    console.log("Could not duplicate project")
    return
  }

  router.push(`/u/${project.ownerId}/p/${project.id}`)
}

export async function createNewProject(name: string) {
  const user = await checkAuth()

  if (!user) {
    console.log("User is not logged in!")
    return
  }

  const dateString = new Date().toUTCString()

  const docRef = await db
    .collection("users")
    .doc(user.uid)
    .collection("projects")
    .add(getNewProject(user.uid, dateString, name))

  router.push(`/u/${user.uid}/p/${docRef.id}`)
}

/* -------------------- Not used yet -------------------- */

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

export async function updateProject(
  pid: string,
  oid: string,
  changes: { [key: string]: any },
) {
  await checkAuth()
  return getProject(pid, oid).update({
    ...changes,
  })
}

export async function createProject(
  pid: string,
  uid: string,
  templateId = "toggle",
) {
  await checkAuth()
  const template = await db.collection("templates").doc(templateId).get()
  return await addProject(pid, uid, template.data())
}

// export async function createNewProject(pid: string, oid: string, uid: string) {
//   await checkAuth()
//   await createProject(pid, uid, "toggle")
//   router.push(`/${uid}/${pid}`)
// }

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
  await checkAuth()
  updateProject(pid, uid, { name })
}
