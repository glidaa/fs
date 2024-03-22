// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const TaskPriority = {
  "HIGH": "high",
  "NORMAL": "normal",
  "LOW": "low"
};

const ProjectPrivacy = {
  "PUBLIC": "public",
  "PRIVATE": "private"
};

const Permissions = {
  "R": "r",
  "RW": "rw"
};

const Plan = {
  "FREE": "free",
  "PRO": "pro"
};

const StatusSynonym = {
  "TODO": "todo",
  "PENDING": "pending",
  "DONE": "done"
};

const HistoryAction = {
  "CREATE": "create",
  "UPDATE": "update",
  "DELETE": "delete",
  "APPEND": "append",
  "REMOVE": "remove"
};

const HistoryField = {
  "COMMENT": "comment",
  "DUE": "due",
  "STATUS": "status",
  "PRIORITY": "priority",
  "ASSIGNEES": "assignees",
  "ANONYMOUS_ASSIGNEES": "anonymousAssignees",
  "INVITED_ASSIGNEES": "invitedAssignees",
  "WATCHERS": "watchers"
};

const TaskUpdateField = {
  "RANK": "rank",
  "TASK": "task",
  "DESCRIPTION": "description",
  "DUE": "due",
  "TAGS": "tags",
  "STATUS": "status",
  "PRIORITY": "priority",
  "ASSIGNEES": "assignees",
  "ANONYMOUS_ASSIGNEES": "anonymousAssignees",
  "INVITED_ASSIGNEES": "invitedAssignees",
  "WATCHERS": "watchers"
};

const { User, Project, Task, Comment, Notification, Status, History, UserUpdate, GotUser, CreatedProject, CreatedTask, CreatedComment, ProjectUpdate, ProjectTitleUpdate, TaskUpdate, CommentUpdate, DeletedProject, DeletedTask, DeletedComment, DeletedNotification, IndividualHistory, InitializedUpload, Empty, Attachment, AttachmentsList, UsersList, ProjectsList, TasksList, CommentsList, NotificationsList, IndividualHistoryList, GenericResult } = initSchema(schema);

export {
  TaskPriority,
  ProjectPrivacy,
  Permissions,
  Plan,
  StatusSynonym,
  HistoryAction,
  HistoryField,
  TaskUpdateField,
  User,
  Project,
  Task,
  Comment,
  Notification,
  Status,
  History,
  UserUpdate,
  GotUser,
  CreatedProject,
  CreatedTask,
  CreatedComment,
  ProjectUpdate,
  ProjectTitleUpdate,
  TaskUpdate,
  CommentUpdate,
  DeletedProject,
  DeletedTask,
  DeletedComment,
  DeletedNotification,
  IndividualHistory,
  InitializedUpload,
  Empty,
  Attachment,
  AttachmentsList,
  UsersList,
  ProjectsList,
  TasksList,
  CommentsList,
  NotificationsList,
  IndividualHistoryList,
  GenericResult
};