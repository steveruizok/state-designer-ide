import * as Types from "types"
import db from "utils/firestore"
import router from "next/router"
import {
  getNewProject,
  // deleteProject,
  // duplicateProjectAndPush,
} from "lib/database"

import { createState } from "@state-designer/react"
import authState from "./auth"

const dialogState = createState({
  data: {
    project: {
      project: null as Types.ProjectData | null,
      currentName: "",
    },
    error: "",
  },
  initial: "closed",
  states: {
    closed: {
      on: {
        OPENED_PROJECT_RENAME_DIALOG: {
          do: "setProject",
          to: "renamingProject",
        },
        OPENED_PROJECT_DELETE_DIALOG: {
          do: "setProject",
          to: "deletingProject",
        },
        OPENED_PROJECT_DUPLICATE_DIALOG: {
          do: "setProjectDuplicate",
          to: "duplicatingProject",
        },
        OPENED_CREATE_PROJECT_DIALOG: {
          do: "setNewProjectName",
          to: "creatingProject",
        },
      },
    },
    open: {
      on: {
        CLOSED: { to: "closed" },
      },
      initial: "idle",
      states: {
        idle: {},
        creatingProject: {
          initial: "confirmingNewProject",
          states: {
            confirmingNewProject: {
              on: {
                CHANGED_PROJECT_NAME: "setProjectName",
                CONFIRMED: { to: "creatingProject.loading" },
              },
            },
            loading: {
              async: {
                await: "createNewProject",
                onResolve: { to: "closed" },
                onReject: { to: "confirmingNewProject" },
              },
            },
          },
        },
        renamingProject: {
          on: {
            PROJECT_UPDATED: "setProject",
            CHANGED_PROJECT_NAME: "setProjectName",
            CONFIRMED: { do: "saveProjectName", to: "closed" },
          },
        },
        duplicatingProject: {
          initial: "confirmingNewDuplicate",
          states: {
            confirmingNewDuplicate: {
              on: {
                CHANGED_PROJECT_NAME: "setProjectName",
                CONFIRMED: { to: "duplicatingProject.loading" },
              },
            },
            loading: {
              async: {
                await: "duplicateProject",
                onResolve: {
                  to: "closed",
                },
                onReject: {
                  to: "confirmingNewDuplicate",
                },
              },
            },
          },
        },
        deletingProject: {
          on: {
            CONFIRMED: { do: "deleteProject", to: "closed" },
          },
        },
      },
    },
  },
  actions: {
    setProject(data, { project }) {
      data.project.project = project
      data.project.currentName = project.name
    },
    setProjectDuplicate(data, { project }) {
      data.project.project = project
      data.project.currentName = project.name + " copy"
    },
    setNewProjectName(data) {
      data.project.currentName = "New Project"
    },
    setProjectName(data, { name }) {
      data.project.currentName = name
    },
    saveProjectName(data) {
      const { project, currentName } = data.project
      return db
        .collection("users")
        .doc(project.ownerId)
        .collection("projects")
        .doc(project.id)
        .update({
          name: currentName,
          lastModified: new Date().toUTCString(),
        })
    },

    deleteProject(data) {
      const { project } = data.project

      const { user } = authState.data

      if (!user) {
        throw Error("No signed in user.")
      }

      db.collection("users")
        .doc(user.id)
        .collection("projects")
        .doc(project.id)
        .delete()
    },
    clearError(data) {
      data.error = ""
    },
  },
  asyncs: {
    async createNewProject(data) {
      const dateString = new Date().toUTCString()

      const { user } = authState.data

      if (!user) {
        throw Error("No signed in user.")
      }

      const docRef = await db
        .collection("users")
        .doc(user.id)
        .collection("projects")
        .add(getNewProject(user.id, dateString, data.project.currentName))

      await router.push(`/u/${user.id}/p/${docRef.id}`)

      return
    },
    async duplicateProject(data) {
      const { project, currentName } = data.project

      const source = await db
        .collection("users")
        .doc(project.ownerId)
        .collection("projects")
        .doc(project.id)
        .get()

      if (!source.exists) {
        throw Error("That project does not exist.")
      }

      const dateString = new Date().toUTCString()

      const { user } = authState.data

      if (!user) {
        throw Error("No signed in user.")
      }

      const sourceData = source.data()

      const newDoc = await db
        .collection("users")
        .doc(user.id)
        .collection("projects")
        .add({
          ...sourceData,
          dateCreated: dateString,
          lastModified: dateString,
          owner: user.id,
          name: currentName || sourceData.name,
        })

      router.push(`/u/${project.ownerId}/p/${newDoc.id}`)
    },
  },
})

export default dialogState

// dialogState.onUpdate((d) => console.log(d.active, d.log[0]))
