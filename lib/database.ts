import * as Types from "types"

import db from "./firestore"
import firebase from "./firebase"
import pick from "lodash/pick"
import router from "next/router"
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

export async function getCustomToken() {
  var path = "/api/refresh"
  var url = process.env.NEXT_PUBLIC_BASE_API_URL + path
  const results = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((d) => d.json())
  return results.customToken
}

export async function setCustomToken(token: string) {
  console.log("Setting custom token received from server.")
  customToken = token
}

export async function checkAuth(): Promise<firebase.User> {
  const { currentUser } = db.app.auth()

  if (!currentUser) {
    if (!customToken) {
      console.log("No custom token set! Getting a new one.")
      const newToken = await getCustomToken()

      if (!newToken) {
        console.log(
          "User will need to log in again. Session token is likely expired. ",
        )
        return null
      }

      customToken = newToken
    }

    await db.app
      .auth()
      .signInWithCustomToken(customToken)
      .catch(async () => {
        console.log("Could not use the current token! Getting a new one...")
        const newToken = await getCustomToken()
        customToken = newToken
      })

    console.log("Ok, let's check that custom token again.")
    return checkAuth()
  } else {
    return currentUser
  }
}

export function subscribeToUserAuth(callback: (user: Types.User) => void) {
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

export async function subscribeToUserChanges(
  uid: string,
  callback: (user: any) => void,
) {
  const docRef = db.collection("users").doc(uid)
  return docRef.onSnapshot((snapshot) => {
    callback(snapshot.data())
  })
}

export async function getUserGroups() {
  const user = await checkAuth()
  const docRef = db.collection("users").doc(user.uid)
  const doc = await docRef.get()
  return Object.values(doc.data().groups || {})
}

export async function getProjectIds(uid: string) {
  const docRef = db.collection("users").doc(uid).collection("projects")
  const initial = await docRef.get()
  let ids: string[] = []
  initial.forEach((doc) => ids.push(doc.id))

  return ids
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
        groups: {
          drafts: {
            id: "drafts",
            name: "Drafts",
            projectIds: [],
          },
        },
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

  const projects = snapshot.docs.reduce((acc, doc) => {
    acc[doc.id] = { id: doc.id, ...doc.data() } as Types.ProjectData
    return acc
  }, {})

  return {
    oid,
    projects,
    isOwner: uid === oid,
  }
}

export async function subscribeToProjects(
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

  const groupId = await getGroupId(user.uid, pid)
  await removeProjectIdFromGroup(pid, groupId)

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

  if (!user) {
    console.log("User is not logged in!")
    return
  }

  const projectRef = db
    .collection("users")
    .doc(oid)
    .collection("projects")
    .doc(pid)

  const project = await projectRef.get()

  if (!project.exists) {
    console.log("That project does not exist!")
    return
  }

  const data = project.data()

  const dateString = new Date().toUTCString()

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

  // What's the group id for the source project?
  const groupId = await getGroupId(user.uid, projectRef.id)

  // Add the duplicate to the source project's groups
  addProjectIdToProjectGroups(groupId, docRef.id)

  return getProjectData(docRef.id, user.uid)
}

export async function getGroupId(oid: string, pid: string) {
  const groups = await getProjectGroups(oid)

  for (let id in groups) {
    if (groups[id].projectIds.includes(pid)) {
      return id
    }
  }

  return null
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

  addProjectIdToProjectGroups("drafts", docRef.id)

  router.push(`/u/${user.uid}/p/${docRef.id}`)
}

export async function getProjectGroups(uid: string) {
  const user = await checkAuth()

  const groups = await db
    .collection("users")
    .doc(user.uid)
    .get()
    .then((d) => d.data().groups)

  if (groups === undefined) {
    const projectIds = await getProjectIds(uid)
    await createProjectGroup({
      name: "Drafts",
      id: "drafts",
      projectIds,
    })
    return getProjectGroups(uid)
  }

  return groups
}

// Project Groups

export async function createProjectGroup(
  group: Types.ProjectGroup,
  projectIds: string[] = [],
) {
  const user = await checkAuth()
  const docRef = db.collection("users").doc(user.uid)
  const snapshot = await docRef.get()
  const { groups = {} } = snapshot.data()

  return docRef.update({
    groups: {
      ...groups,
      [group.id]: group,
    },
  })
}

export async function renameProjectGroup(groupId: string, name: string) {
  const user = await checkAuth()
  const docRef = db.collection("users").doc(user.uid)
  const snapshot = await docRef.get()
  const { groups } = snapshot.data()

  return docRef.update({
    groups: {
      ...groups,
      [groupId]: {
        ...groups[groupId],
        name,
      },
    },
  })
}

export async function deleteProjectGroup() {}

export async function addProjectIdToProjectGroups(
  groupId: string,
  pid: string,
) {
  const user = await checkAuth()

  const userDocRef = db.collection("users").doc(user.uid)

  const current = await userDocRef.get().then((d) => d.data())

  if (!current.groups[groupId]) {
    console.log("No group with that name!")
    return
  }

  userDocRef.update({
    groups: {
      ...current.groups,
      [groupId]: {
        id: groupId,
        name: current.groups[groupId].name,
        projectIds: [...current.groups[groupId].projectIds, pid],
      },
    },
  })
}

export async function removeProjectIdFromGroup(pid: string, groupId: string) {
  const user = await checkAuth()
  const docRef = db.collection("users").doc(user.uid)
  const snapshot = await docRef.get()
  const { groups } = snapshot.data()

  groups[groupId].projectIds = groups[groupId].projectIds.filter(
    (id: string) => id !== pid,
  )

  return docRef.update({
    groups,
  })
}

export async function moveProjectToGroup(
  pid: string,
  fromId: string,
  toId: string,
) {
  const user = await checkAuth()
  const docRef = db.collection("users").doc(user.uid)
  const snapshot = await docRef.get()
  const { groups } = snapshot.data()

  if (groups[toId].projectIds.includes(pid)) {
    console.log("Id is already in that group!")
    return
  }

  groups[toId].projectIds.push(pid)

  groups[fromId].projectIds = groups[fromId].projectIds.filter(
    (id: string) => id !== pid,
  )

  return docRef.update({
    groups,
  })
}

export async function moveProjectsToGroup(
  uid: string,
  toId: string,
  projectIds: string[],
) {
  const user = await checkAuth()
  const docRef = db.collection("users").doc(user.uid)
  const snapshot = await docRef.get()
  const { groups } = snapshot.data()

  // Move ids into the target group
  for (let pid of projectIds) {
    if (groups[toId].projectIds.includes(pid)) {
      console.log(`Project ${pid} is already in that group!`)
      return
    }
    groups[toId].projectIds.push(pid)
  }

  // Filter ids out of all other groups
  for (let gid in groups) {
    if (gid === toId) continue
    groups[gid].projectIds = groups[gid].projectIds.filter(
      (id: string) => !projectIds.includes(id),
    )
  }

  return docRef.update({
    groups,
  })
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

export async function getCodeSandboxUrl(oid: string, pid: string) {
  var path = `/api/sandbox`
  var url = process.env.NEXT_PUBLIC_BASE_API_URL + path
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ oid, pid }),
  }).then((d) => d.json())
}
