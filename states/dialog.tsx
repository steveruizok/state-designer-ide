import * as Types from "types"

import {
  createNewProject,
  createProjectGroup,
  deleteProject,
  duplicateProject,
  moveProjectToGroup,
  renameProjectGroup,
  saveProjectName,
} from "lib/database"

import { createState } from "@state-designer/react"
import { uniqueId } from "lodash"

const dialogState = createState({
  data: {
    project: {
      project: null as Types.ProjectData | null,
      groupId: "",
      currentName: "",
    },
    projectGroup: {
      group: null as Types.ProjectGroup | null,
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
          do: ["setProject", "addCopyToCurrentName"],
          to: "duplicatingProject",
        },
        OPENED_CREATE_PROJECT_DIALOG: {
          do: "setNewProjectName",
          to: "creatingProject",
        },
        OPENED_MOVE_PROJECT_DIALOG: {
          do: "setProject",
          to: "movingProjectToGroup",
        },
        OPENED_CREATE_PROJECT_GROUP_DIALOG: {
          do: "setNewProjectGroup",
          to: "creatingProjectGroup",
        },
        OPENED_RENAME_PROJECT_GROUP_DIALOG: {
          do: "setProjectGroup",
          to: "renamingProjectGroup",
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
            CHANGED_PROJECT_NAME: "updateProjectName",
            CONFIRMED: { do: "createNewProject", to: "closed" },
          },
        },
        renamingProject: {
          on: {
            PROJECT_UPDATED: "setProject",
            CHANGED_PROJECT_NAME: "updateProjectName",
            CONFIRMED: { do: "saveProjectName", to: "closed" },
          },
        },
        duplicatingProject: {
          on: {
            CHANGED_PROJECT_NAME: "updateProjectName",
            CONFIRMED: { do: "duplicateProject", to: "closed" },
          },
        },
        deletingProject: {
          on: {
            CONFIRMED: { do: "deleteProject", to: "closed" },
          },
        },
        creatingProjectGroup: {
          on: {
            CHANGED_PROJECT_GROUP_NAME: "updateProjectGroupName",
            CONFIRMED: { do: "createProjectGroup", to: "closed" },
          },
        },
        renamingProjectGroup: {
          on: {
            CHANGED_PROJECT_GROUP_NAME: "updateProjectGroupName",
            CONFIRMED: { do: "updateProjectGroup", to: "closed" },
          },
        },
        movingProjectToGroup: {
          on: {
            SELECTED_GROUP: {
              do: "moveProjectToGroup",
              to: "closed",
            },
          },
        },
      },
    },
  },
  actions: {
    setProject(data, { project, groupId }) {
      data.project.project = project
      data.project.groupId = groupId
      data.project.currentName = project.name
    },
    addCopyToCurrentName(data) {
      data.project.currentName += " copy"
    },
    setNewProjectName(data) {
      data.project.currentName = "New Project"
    },
    updateProjectName(data, { name }) {
      data.project.currentName = name
    },
    saveProjectName(data) {
      const { project, currentName } = data.project
      saveProjectName(project.id, project.ownerId, currentName)
    },
    duplicateProject(data) {
      const { project, currentName } = data.project
      duplicateProject(project.id, project.ownerId, currentName)
    },
    deleteProject(data) {
      const { project } = data.project
      deleteProject(project.id)
    },
    createNewProject(data) {
      const { currentName } = data.project
      createNewProject(currentName)
    },
    // Groups
    setNewProjectGroup(data) {
      data.projectGroup.currentName = "New Group"
    },
    setProjectGroup(data, { group }: { group: Types.ProjectGroup }) {
      data.projectGroup.group = group
      data.projectGroup.currentName = group.name
    },
    updateProjectGroupName(data, { name }) {
      data.projectGroup.currentName = name
    },
    createProjectGroup(data) {
      createProjectGroup({
        id: uniqueId(),
        name: data.projectGroup.currentName,
        projectIds: [],
      })
    },
    updateProjectGroup(data) {
      renameProjectGroup(
        data.projectGroup.group.id,
        data.projectGroup.currentName,
      )
    },
    moveProjectToGroup(data, { groupId }: { groupId: string }) {
      const { groupId: fromId } = data.project
      moveProjectToGroup(data.project.project.id, fromId, groupId)
    },
  },
})

export default dialogState
