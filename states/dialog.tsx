import * as Types from "types"

import {
  createNewProject,
  deleteProject,
  duplicateProjectAndPush,
  saveProjectName,
} from "lib/database"

import { ToastMessage } from "types"
import { createState } from "@state-designer/react"
import uniqueId from "lodash/uniqueId"

const dialogState = createState({
  data: {
    project: {
      project: null as Types.ProjectData | null,
      currentName: "",
    },
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
          on: {
            CHANGED_PROJECT_NAME: "setProjectName",
            CONFIRMED: { do: "createNewProject", to: "closed" },
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
          on: {
            CHANGED_PROJECT_NAME: "setProjectName",
            CONFIRMED: { do: "duplicateProject", to: "closed" },
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
      saveProjectName(project.id, project.ownerId, currentName)
    },
    duplicateProject(data) {
      const { project, currentName } = data.project
      duplicateProjectAndPush(project.id, project.ownerId, currentName)
    },
    deleteProject(data) {
      const { project } = data.project
      deleteProject(project.id)
    },
    createNewProject(data) {
      const { currentName } = data.project
      createNewProject(currentName)
    },
  },
})

export default dialogState
