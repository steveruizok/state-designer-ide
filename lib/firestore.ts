import firebase from "./firebase"

const db = firebase.firestore()

export async function getUserProjects(uid: string) {
  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("projects")
    .get()

  return snapshot.docs.map((doc) =>
    JSON.stringify({ id: doc.id, data: doc.data() })
  )
}

export function updateProjectName(pid: string, oid: string, name: string) {
  return db
    .collection("users")
    .doc(oid)
    .collection("projects")
    .doc(pid)
    .update({
      name,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
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

export default db
