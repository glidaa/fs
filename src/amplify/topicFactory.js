import * as projectsActions from "../actions/projects"
import * as tasksActions from "../actions/tasks"
import * as commentsActions from "../actions/comments"
import * as notificationsActions from "../actions/notifications"
import * as appActions from "../actions/app"
import * as userActions from "../actions/user"
import * as usersActions from "../actions/users"
import * as historyActions from "../actions/history"
import * as mutationId from "../utils/mutationId"
import filterObj from "../utils/filterObj";
import updateAssignedTasks from "../pushedUpdates/updateAssignedTasks";
import updateWatchedTasks from "../pushedUpdates/updateWatchedTasks";
import generateId from "../utils/generateId";
import store from "../store"
import { navigate } from "../components/Router"
import PubSub from "./PubSub"

const subscriptionsTemplates = {
  notifications: [{
    type: "onPushNotification",
    next: async e => {
      const { notifications } = store.getState()
      const incoming = e.value.data.onPushNotification
      if (!notifications.stored.filter(x => x.id === incoming.id).length) {
        await store.dispatch(usersActions.handleAddUsers([incoming.mutator]))
        store.dispatch(notificationsActions.add(incoming))
        store.dispatch(notificationsActions.push(incoming))
      }
    },
    error: error => console.warn(error)
  },
  {
    type: "onDismissNotification",
    next: e => {
      const { notifications } = store.getState()
      const incoming = e.value.data.onDismissNotification
      if (notifications.stored.filter(x => x.id === incoming.id).length) {
        store.dispatch(notificationsActions.dismiss(incoming.id))
        store.dispatch(notificationsActions.remove(incoming.id))
      }
    },
    error: error => console.warn(error)
  }],
  user: [
    {
      type: "onPushUserUpdate",
      next: e => {
        const incoming = e.value.data.onPushUserUpdate
        store.dispatch(userActions.handleSetData(incoming))
        updateAssignedTasks(store.dispatch, store.getState, incoming)
        updateWatchedTasks(store.dispatch, store.getState, incoming)
      },
      error: error => console.warn(error)
    }
  ],
  ownedProjects: [
    {
      type: "onCreateOwnedProject",
      next: e => {
        const { projects } = store.getState()
        const ownedProjects = filterObj(projects, x => x.isOwned)
        const incoming = e.value.data.onCreateOwnedProject
        if (!mutationId.isLocal(incoming.mutationId)) {
          if (!Object.keys(ownedProjects).includes(incoming.id)) {
            store.dispatch(projectsActions.createProject(incoming, "owned"))
          }
        }
      },
      error: error => console.warn(error)
    },
    {
      type: "onUpdateOwnedProject",
      next: e => {
        const { projects } = store.getState()
        const ownedProjects = filterObj(projects, x => x.isOwned)
        const incoming = e.value.data.onUpdateOwnedProject
        if (!mutationId.isLocal(incoming.mutationId)) {
          if (Object.keys(ownedProjects).includes(incoming.id)) {
            const lastMutationDate = projects[incoming.id].mutatedAt || null
            const mutationDate = new Date(incoming.updatedAt).getTime()
            if (!mutationDate || (mutationDate && lastMutationDate < mutationDate)) {
              store.dispatch(projectsActions.updateProject({
                ...incoming,
                mutatedAt: mutationDate
              }))
            }
          }
        }
      },
      error: error => console.warn(error)
    },
    {
      type: "onDeleteOwnedProject",
      next: e => {
        const { app, projects } = store.getState()
        const ownedProjects = filterObj(projects, x => x.isOwned)
        const incoming = e.value.data.onDeleteOwnedProject;
        if (!mutationId.isLocal(incoming.mutationId)) {
          if (Object.keys(ownedProjects).includes(incoming.id)) {
            if (app.selectedProject === incoming.id) {
              store.dispatch(appActions.handleSetTask(null))
            }
            store.dispatch(projectsActions.removeProject(incoming.id))
          }
        }
      },
      error: error => console.warn(error)
    }
  ],
  project: [
    {
      type: "onUpdateProject",
      next: e => {
        const { projects, app } = store.getState()
        const incoming = e.value.data.onUpdateProject
        if (projects[incoming.id]) {
          if (!mutationId.isLocal(incoming.mutationId)) {
            const lastMutationDate = projects[incoming.id].mutatedAt || null
            const mutationDate = new Date(incoming.updatedAt).getTime()
            if (!mutationDate || (mutationDate && lastMutationDate < mutationDate)) {
              const prevPermalink = projects[incoming.id].permalink
              store.dispatch(projectsActions.updateProject({
                ...incoming,
                mutatedAt: mutationDate
              }))
              if (app.selectedProject === incoming.id && incoming.permalink !== prevPermalink) {
                navigate("/" + incoming.owner + "/" + incoming.permalink, true)
              }
            }
          }
        }
      },
      error: error => console.warn(error)
    },
    {
      type: "onDeleteProject",
      next: e => {
        const { app, projects } = store.getState()
        const incoming = e.value.data.onDeleteProject;
        if (projects[incoming.id]) {
          if (!mutationId.isLocal(incoming.mutationId)) {
            PubSub.unsubscribeTopic("project", incoming.id)
            if (app.selectedProject === incoming.id) {
              store.dispatch(appActions.handleSetProject(null))
            }
            store.dispatch(projectsActions.removeProject(incoming.id))
          }
        }
      },
      error: error => console.warn(error)
    }
  ],
  tasks: [
    {
      type: "onCreateTaskByProjectId",
      next: async (e) => {
        const { tasks } = store.getState()
        const incoming = e.value.data.onCreateTaskByProjectId
        if (!mutationId.isLocal(incoming.mutationId)) {
          if (!Object.keys(tasks).includes(incoming.id)) {
            const usersToBeFetched = [...new Set([
              ...incoming.assignees.filter(x => /^user:.*$/.test(x)).map(x => x.replace(/^user:/, "")),
              ...incoming.watchers
            ])]
            await store.dispatch(usersActions.handleAddUsers(usersToBeFetched))
            store.dispatch(tasksActions.createTask(incoming))
          }
        }
      },
      error: error => console.warn(error)
    },
    {
      type: "onUpdateTaskByProjectId",
      next: async (e) => {
        const { app, tasks } = store.getState()
        const incoming = e.value.data.onUpdateTaskByProjectId
        if (
          app.selectedTask === incoming.id && (
          incoming.field === "due" ||
          incoming.field === "status" ||
          incoming.field === "priority" ||
          incoming.field === "assignees" ||
          incoming.field === "anonymousAssignees" ||
          incoming.field === "invitedAssignees" ||
          incoming.field === "watchers")
        ) {
          store.dispatch(historyActions.createHistory({
            id: incoming.mutationId,
            action: incoming.action,
            field: incoming.field,
            value: incoming.value,
            createdAt: incoming.updatedAt,
            updatedAt: incoming.updatedAt,
            owner: /(.*?)-\w+-\w+$/.exec(incoming.mutationId)[1],
          }))
        }
        if (!mutationId.isLocal(incoming.mutationId)) {
          if (Object.keys(tasks).includes(incoming.id)) {
            const lastMutationDate = tasks[incoming.id].mutatedAt || null
            const mutationDate = new Date(incoming.updatedAt).getTime()
            if (!mutationDate || (mutationDate && lastMutationDate < mutationDate)) {
              const usersToBeFetched = [...new Set([
                ...(incoming.assignees || []),
                ...(incoming.watchers || [])
              ])]
              await store.dispatch(usersActions.handleAddUsers(usersToBeFetched))
              store.dispatch(tasksActions.updateTask({
                id: incoming.id,
                action: incoming.action,
                field: incoming.field,
                value: incoming.field === "tags"
                  ? JSON.parse(incoming.value)
                  : incoming.value,
                mutatedAt: mutationDate
              }))
            }
          }
        }
      },
      error: error => console.warn(error)
    },
    {
      type: "onDeleteTaskByProjectId",
      next: e => {
        const { tasks, app } = store.getState()
        const incoming = e.value.data.onDeleteTaskByProjectId;
        if (!mutationId.isLocal(incoming.mutationId)) {
          if (Object.keys(tasks).includes(incoming.id)) {
            if (app.selectedTask === incoming.id) {
              store.dispatch(appActions.handleSetTask(null))
            }
            store.dispatch(tasksActions.removeTask(incoming.id))
          }
        }
      },
      error: error => console.warn(error)
    }
  ],
  comments: [
    {
      type: "onCreateCommentByTaskId",
      next: async (e) => {
        const { comments } = store.getState()
        const incoming = e.value.data.onCreateCommentByTaskId
        if (!mutationId.isLocal(incoming.mutationId)) {
          if (!Object.keys(comments).includes(incoming.id)) {
            await store.dispatch(usersActions.handleAddUsers([incoming.owner]))
            store.dispatch(commentsActions.createComment(incoming))
          }
        }
      },
      error: error => console.warn(error)
    },
    {
      type: "onDeleteCommentByTaskId",
      next: e => {
        const { comments } = store.getState()
        const incoming = e.value.data.onDeleteCommentByTaskId;
        if (!mutationId.isLocal(incoming.mutationId)) {
          if (Object.keys(comments).includes(incoming.id)) {
            store.dispatch(commentsActions.removeComment(incoming.id))
          }
        }
      },
      error: error => console.warn(error)
    }
  ]
}

const variablesGetters = {
  notifications: () => ({
    owner: store.getState().user.data.username
  }),
  user: () => ({
    username: store.getState().user.data.username
  }),
  ownedProjects: () => ({
    owner: store.getState().user.data.username
  }),
  project: (projectId) => ({
    id: projectId
  }),
  tasks: (projectId) => ({
    projectId: projectId
  }),
  comments: (taskId) => ({
    taskId: taskId
  }),
}

export const getTopic = (topic, variant = null) => {
  const result = [];
  const variables = variablesGetters[topic](variant);
  for (const subscription of subscriptionsTemplates[topic]) {
    result.push({
      id: generateId(),
      type: subscription.type,
      variables: variables,
      variant: variant,
      next: subscription.next,
      error: subscription.error
    })
  }
  return result;
}