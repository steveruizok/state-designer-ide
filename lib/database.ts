import router from "next/router"
import * as Types from "types"

import firebase from "./firebase"
import db from "./firestore"

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
    return { ...data, pid, oid: data.owner } as Types.ProjectData
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

const codeKeys = {
  state: "code",
  view: "jsx",
  static: "statics",
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
      [codeKeys[activeTab]]: JSON.stringify(code),
    })
}

export function saveProjectName(pid: string, oid: string, name: string) {
  db.collection("users")
    .doc(oid)
    .collection("projects")
    .doc(pid)
    .update({
      name: JSON.stringify(name),
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

// This is mostly a stupid fix to prevent "ghost entries" for
// users. We need to define some property on the user doc in order
// to fetch a list of existing users in admin. So if the user
// is new, create an entry with `exists: true`, otherwise add
// that entry (if missing) to the user's doc.
export async function addUser(uid: string) {
  const user = db.collection("users").doc(uid)
  const initial = await user.get()

  if (initial.exists) {
    if (!initial.data().exists) {
      user.update({ exists: true, loggedIn: Date.now() }).catch((e) => {
        console.log("Error setting user", uid, e.message)
      })
    }
  } else {
    user
      .set({ exists: true, created: Date.now(), loggedIn: Date.now() })
      .catch((e) => {
        console.log("Error setting user", uid, e.message)
      })
  }
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

export async function updateProjectJsx(
  pid: string,
  oid: string,
  uid: string,
  code: string,
) {
  // must be owner
  if (uid === oid) {
    return updateProject(pid, oid, {
      jsx: JSON.stringify(code),
    })
  }
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
      code: JSON.stringify(code),
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
