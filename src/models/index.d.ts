import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export enum TaskPriority {
  HIGH = "high",
  NORMAL = "normal",
  LOW = "low"
}

export enum ProjectPrivacy {
  PUBLIC = "public",
  PRIVATE = "private"
}

export enum Permissions {
  R = "r",
  RW = "rw"
}

export enum Plan {
  FREE = "free",
  PRO = "pro"
}

export enum StatusSynonym {
  TODO = "todo",
  PENDING = "pending",
  DONE = "done"
}

export enum HistoryAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  APPEND = "append",
  REMOVE = "remove"
}

export enum HistoryField {
  COMMENT = "comment",
  DUE = "due",
  STATUS = "status",
  PRIORITY = "priority",
  ASSIGNEES = "assignees",
  ANONYMOUS_ASSIGNEES = "anonymousAssignees",
  INVITED_ASSIGNEES = "invitedAssignees",
  WATCHERS = "watchers"
}

export enum TaskUpdateField {
  RANK = "rank",
  TASK = "task",
  DESCRIPTION = "description",
  DUE = "due",
  TAGS = "tags",
  STATUS = "status",
  PRIORITY = "priority",
  ASSIGNEES = "assignees",
  ANONYMOUS_ASSIGNEES = "anonymousAssignees",
  INVITED_ASSIGNEES = "invitedAssignees",
  WATCHERS = "watchers"
}

type EagerUser = {
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly plan: Plan | keyof typeof Plan;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyUser = {
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly plan: Plan | keyof typeof Plan;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User)

type EagerProject = {
  readonly id: string;
  readonly permalink: string;
  readonly rank: number;
  readonly title: string;
  readonly privacy: ProjectPrivacy | keyof typeof ProjectPrivacy;
  readonly permissions: Permissions | keyof typeof Permissions;
  readonly statusSet: Status[];
  readonly defaultStatus: string;
  readonly totalTasks: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
}

type LazyProject = {
  readonly id: string;
  readonly permalink: string;
  readonly rank: number;
  readonly title: string;
  readonly privacy: ProjectPrivacy | keyof typeof ProjectPrivacy;
  readonly permissions: Permissions | keyof typeof Permissions;
  readonly statusSet: Status[];
  readonly defaultStatus: string;
  readonly totalTasks: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
}

export declare type Project = LazyLoading extends LazyLoadingDisabled ? EagerProject : LazyProject

export declare const Project: (new (init: ModelInit<Project>) => Project)

type EagerTask = {
  readonly id: string;
  readonly projectId: string;
  readonly permalink: number;
  readonly rank: number;
  readonly task?: string | null;
  readonly description?: string | null;
  readonly due?: string | null;
  readonly tags: string[];
  readonly status: string;
  readonly priority: TaskPriority | keyof typeof TaskPriority;
  readonly assignees: string[];
  readonly anonymousAssignees: string[];
  readonly invitedAssignees: string[];
  readonly watchers: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyTask = {
  readonly id: string;
  readonly projectId: string;
  readonly permalink: number;
  readonly rank: number;
  readonly task?: string | null;
  readonly description?: string | null;
  readonly due?: string | null;
  readonly tags: string[];
  readonly status: string;
  readonly priority: TaskPriority | keyof typeof TaskPriority;
  readonly assignees: string[];
  readonly anonymousAssignees: string[];
  readonly invitedAssignees: string[];
  readonly watchers: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type Task = LazyLoading extends LazyLoadingDisabled ? EagerTask : LazyTask

export declare const Task: (new (init: ModelInit<Task>) => Task)

type EagerComment = {
  readonly id: string;
  readonly taskId: string;
  readonly content: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
}

type LazyComment = {
  readonly id: string;
  readonly taskId: string;
  readonly content: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
}

export declare type Comment = LazyLoading extends LazyLoadingDisabled ? EagerComment : LazyComment

export declare const Comment: (new (init: ModelInit<Comment>) => Comment)

type EagerNotification = {
  readonly id: string;
  readonly projectId: string;
  readonly taskId?: string | null;
  readonly commentId?: string | null;
  readonly action: HistoryAction | keyof typeof HistoryAction;
  readonly field: HistoryField | keyof typeof HistoryField;
  readonly value?: string | null;
  readonly hint?: string | null;
  readonly read: boolean;
  readonly link: string;
  readonly mutator: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
}

type LazyNotification = {
  readonly id: string;
  readonly projectId: string;
  readonly taskId?: string | null;
  readonly commentId?: string | null;
  readonly action: HistoryAction | keyof typeof HistoryAction;
  readonly field: HistoryField | keyof typeof HistoryField;
  readonly value?: string | null;
  readonly hint?: string | null;
  readonly read: boolean;
  readonly link: string;
  readonly mutator: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
}

export declare type Notification = LazyLoading extends LazyLoadingDisabled ? EagerNotification : LazyNotification

export declare const Notification: (new (init: ModelInit<Notification>) => Notification)

type EagerStatus = {
  readonly id: string;
  readonly title: string;
  readonly synonym: StatusSynonym | keyof typeof StatusSynonym;
}

type LazyStatus = {
  readonly id: string;
  readonly title: string;
  readonly synonym: StatusSynonym | keyof typeof StatusSynonym;
}

export declare type Status = LazyLoading extends LazyLoadingDisabled ? EagerStatus : LazyStatus

export declare const Status: (new (init: ModelInit<Status>) => Status)

type EagerHistory = {
  readonly id: string;
  readonly projectId: string;
  readonly taskId?: string | null;
  readonly commentId?: string | null;
  readonly action: HistoryAction | keyof typeof HistoryAction;
  readonly field: HistoryField | keyof typeof HistoryField;
  readonly value?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
}

type LazyHistory = {
  readonly id: string;
  readonly projectId: string;
  readonly taskId?: string | null;
  readonly commentId?: string | null;
  readonly action: HistoryAction | keyof typeof HistoryAction;
  readonly field: HistoryField | keyof typeof HistoryField;
  readonly value?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
}

export declare type History = LazyLoading extends LazyLoadingDisabled ? EagerHistory : LazyHistory

export declare const History: (new (init: ModelInit<History>) => History)

type EagerUserUpdate = {
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly updatedAt: string;
}

type LazyUserUpdate = {
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly updatedAt: string;
}

export declare type UserUpdate = LazyLoading extends LazyLoadingDisabled ? EagerUserUpdate : LazyUserUpdate

export declare const UserUpdate: (new (init: ModelInit<UserUpdate>) => UserUpdate)

type EagerGotUser = {
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyGotUser = {
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type GotUser = LazyLoading extends LazyLoadingDisabled ? EagerGotUser : LazyGotUser

export declare const GotUser: (new (init: ModelInit<GotUser>) => GotUser)

type EagerCreatedProject = {
  readonly id: string;
  readonly permalink: string;
  readonly rank: number;
  readonly title: string;
  readonly privacy: ProjectPrivacy | keyof typeof ProjectPrivacy;
  readonly permissions: Permissions | keyof typeof Permissions;
  readonly statusSet: Status[];
  readonly defaultStatus: string;
  readonly totalTasks: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly mutationId?: string | null;
}

type LazyCreatedProject = {
  readonly id: string;
  readonly permalink: string;
  readonly rank: number;
  readonly title: string;
  readonly privacy: ProjectPrivacy | keyof typeof ProjectPrivacy;
  readonly permissions: Permissions | keyof typeof Permissions;
  readonly statusSet: Status[];
  readonly defaultStatus: string;
  readonly totalTasks: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly mutationId?: string | null;
}

export declare type CreatedProject = LazyLoading extends LazyLoadingDisabled ? EagerCreatedProject : LazyCreatedProject

export declare const CreatedProject: (new (init: ModelInit<CreatedProject>) => CreatedProject)

type EagerCreatedTask = {
  readonly id: string;
  readonly projectId: string;
  readonly permalink: number;
  readonly rank: number;
  readonly task?: string | null;
  readonly description?: string | null;
  readonly due?: string | null;
  readonly tags: string[];
  readonly status: string;
  readonly priority: TaskPriority | keyof typeof TaskPriority;
  readonly assignees: string[];
  readonly watchers: string[];
  readonly anonymousAssignees: string[];
  readonly invitedAssignees: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly mutationId?: string | null;
}

type LazyCreatedTask = {
  readonly id: string;
  readonly projectId: string;
  readonly permalink: number;
  readonly rank: number;
  readonly task?: string | null;
  readonly description?: string | null;
  readonly due?: string | null;
  readonly tags: string[];
  readonly status: string;
  readonly priority: TaskPriority | keyof typeof TaskPriority;
  readonly assignees: string[];
  readonly watchers: string[];
  readonly anonymousAssignees: string[];
  readonly invitedAssignees: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly mutationId?: string | null;
}

export declare type CreatedTask = LazyLoading extends LazyLoadingDisabled ? EagerCreatedTask : LazyCreatedTask

export declare const CreatedTask: (new (init: ModelInit<CreatedTask>) => CreatedTask)

type EagerCreatedComment = {
  readonly id: string;
  readonly taskId: string;
  readonly content: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly mutationId?: string | null;
}

type LazyCreatedComment = {
  readonly id: string;
  readonly taskId: string;
  readonly content: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly mutationId?: string | null;
}

export declare type CreatedComment = LazyLoading extends LazyLoadingDisabled ? EagerCreatedComment : LazyCreatedComment

export declare const CreatedComment: (new (init: ModelInit<CreatedComment>) => CreatedComment)

type EagerProjectUpdate = {
  readonly id: string;
  readonly permalink: string;
  readonly rank: number;
  readonly title: string;
  readonly privacy: ProjectPrivacy | keyof typeof ProjectPrivacy;
  readonly permissions: Permissions | keyof typeof Permissions;
  readonly statusSet: Status[];
  readonly defaultStatus: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly mutationId?: string | null;
}

type LazyProjectUpdate = {
  readonly id: string;
  readonly permalink: string;
  readonly rank: number;
  readonly title: string;
  readonly privacy: ProjectPrivacy | keyof typeof ProjectPrivacy;
  readonly permissions: Permissions | keyof typeof Permissions;
  readonly statusSet: Status[];
  readonly defaultStatus: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly mutationId?: string | null;
}

export declare type ProjectUpdate = LazyLoading extends LazyLoadingDisabled ? EagerProjectUpdate : LazyProjectUpdate

export declare const ProjectUpdate: (new (init: ModelInit<ProjectUpdate>) => ProjectUpdate)

type EagerProjectTitleUpdate = {
  readonly id: string;
  readonly title: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly mutationId?: string | null;
}

type LazyProjectTitleUpdate = {
  readonly id: string;
  readonly title: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly mutationId?: string | null;
}

export declare type ProjectTitleUpdate = LazyLoading extends LazyLoadingDisabled ? EagerProjectTitleUpdate : LazyProjectTitleUpdate

export declare const ProjectTitleUpdate: (new (init: ModelInit<ProjectTitleUpdate>) => ProjectTitleUpdate)

type EagerTaskUpdate = {
  readonly id: string;
  readonly projectId: string;
  readonly action: HistoryAction | keyof typeof HistoryAction;
  readonly field: TaskUpdateField | keyof typeof TaskUpdateField;
  readonly value: string;
  readonly updatedAt: string;
  readonly mutationId?: string | null;
}

type LazyTaskUpdate = {
  readonly id: string;
  readonly projectId: string;
  readonly action: HistoryAction | keyof typeof HistoryAction;
  readonly field: TaskUpdateField | keyof typeof TaskUpdateField;
  readonly value: string;
  readonly updatedAt: string;
  readonly mutationId?: string | null;
}

export declare type TaskUpdate = LazyLoading extends LazyLoadingDisabled ? EagerTaskUpdate : LazyTaskUpdate

export declare const TaskUpdate: (new (init: ModelInit<TaskUpdate>) => TaskUpdate)

type EagerCommentUpdate = {
  readonly id: string;
  readonly taskId: string;
  readonly content: string;
  readonly updatedAt: string;
  readonly mutationId?: string | null;
}

type LazyCommentUpdate = {
  readonly id: string;
  readonly taskId: string;
  readonly content: string;
  readonly updatedAt: string;
  readonly mutationId?: string | null;
}

export declare type CommentUpdate = LazyLoading extends LazyLoadingDisabled ? EagerCommentUpdate : LazyCommentUpdate

export declare const CommentUpdate: (new (init: ModelInit<CommentUpdate>) => CommentUpdate)

type EagerDeletedProject = {
  readonly id: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly mutationId?: string | null;
}

type LazyDeletedProject = {
  readonly id: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly mutationId?: string | null;
}

export declare type DeletedProject = LazyLoading extends LazyLoadingDisabled ? EagerDeletedProject : LazyDeletedProject

export declare const DeletedProject: (new (init: ModelInit<DeletedProject>) => DeletedProject)

type EagerDeletedTask = {
  readonly id: string;
  readonly projectId: string;
  readonly updatedAt: string;
  readonly mutationId?: string | null;
}

type LazyDeletedTask = {
  readonly id: string;
  readonly projectId: string;
  readonly updatedAt: string;
  readonly mutationId?: string | null;
}

export declare type DeletedTask = LazyLoading extends LazyLoadingDisabled ? EagerDeletedTask : LazyDeletedTask

export declare const DeletedTask: (new (init: ModelInit<DeletedTask>) => DeletedTask)

type EagerDeletedComment = {
  readonly id: string;
  readonly taskId: string;
  readonly updatedAt: string;
  readonly mutationId?: string | null;
}

type LazyDeletedComment = {
  readonly id: string;
  readonly taskId: string;
  readonly updatedAt: string;
  readonly mutationId?: string | null;
}

export declare type DeletedComment = LazyLoading extends LazyLoadingDisabled ? EagerDeletedComment : LazyDeletedComment

export declare const DeletedComment: (new (init: ModelInit<DeletedComment>) => DeletedComment)

type EagerDeletedNotification = {
  readonly id: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly mutationId?: string | null;
}

type LazyDeletedNotification = {
  readonly id: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly mutationId?: string | null;
}

export declare type DeletedNotification = LazyLoading extends LazyLoadingDisabled ? EagerDeletedNotification : LazyDeletedNotification

export declare const DeletedNotification: (new (init: ModelInit<DeletedNotification>) => DeletedNotification)

type EagerIndividualHistory = {
  readonly id: string;
  readonly action: HistoryAction | keyof typeof HistoryAction;
  readonly field: HistoryField | keyof typeof HistoryField;
  readonly value?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
}

type LazyIndividualHistory = {
  readonly id: string;
  readonly action: HistoryAction | keyof typeof HistoryAction;
  readonly field: HistoryField | keyof typeof HistoryField;
  readonly value?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
}

export declare type IndividualHistory = LazyLoading extends LazyLoadingDisabled ? EagerIndividualHistory : LazyIndividualHistory

export declare const IndividualHistory: (new (init: ModelInit<IndividualHistory>) => IndividualHistory)

type EagerInitializedUpload = {
  readonly presignedUrl: string;
}

type LazyInitializedUpload = {
  readonly presignedUrl: string;
}

export declare type InitializedUpload = LazyLoading extends LazyLoadingDisabled ? EagerInitializedUpload : LazyInitializedUpload

export declare const InitializedUpload: (new (init: ModelInit<InitializedUpload>) => InitializedUpload)

type EagerEmpty = {
  readonly success: boolean;
}

type LazyEmpty = {
  readonly success: boolean;
}

export declare type Empty = LazyLoading extends LazyLoadingDisabled ? EagerEmpty : LazyEmpty

export declare const Empty: (new (init: ModelInit<Empty>) => Empty)

type EagerAttachment = {
  readonly id: string;
  readonly filename: string;
  readonly contentType: string;
  readonly size: number;
  readonly url: string;
}

type LazyAttachment = {
  readonly id: string;
  readonly filename: string;
  readonly contentType: string;
  readonly size: number;
  readonly url: string;
}

export declare type Attachment = LazyLoading extends LazyLoadingDisabled ? EagerAttachment : LazyAttachment

export declare const Attachment: (new (init: ModelInit<Attachment>) => Attachment)

type EagerAttachmentsList = {
  readonly items?: Attachment[] | null;
}

type LazyAttachmentsList = {
  readonly items?: Attachment[] | null;
}

export declare type AttachmentsList = LazyLoading extends LazyLoadingDisabled ? EagerAttachmentsList : LazyAttachmentsList

export declare const AttachmentsList: (new (init: ModelInit<AttachmentsList>) => AttachmentsList)

type EagerUsersList = {
  readonly items?: GotUser[] | null;
}

type LazyUsersList = {
  readonly items?: GotUser[] | null;
}

export declare type UsersList = LazyLoading extends LazyLoadingDisabled ? EagerUsersList : LazyUsersList

export declare const UsersList: (new (init: ModelInit<UsersList>) => UsersList)

type EagerProjectsList = {
  readonly items?: Project[] | null;
}

type LazyProjectsList = {
  readonly items?: Project[] | null;
}

export declare type ProjectsList = LazyLoading extends LazyLoadingDisabled ? EagerProjectsList : LazyProjectsList

export declare const ProjectsList: (new (init: ModelInit<ProjectsList>) => ProjectsList)

type EagerTasksList = {
  readonly items?: Task[] | null;
}

type LazyTasksList = {
  readonly items?: Task[] | null;
}

export declare type TasksList = LazyLoading extends LazyLoadingDisabled ? EagerTasksList : LazyTasksList

export declare const TasksList: (new (init: ModelInit<TasksList>) => TasksList)

type EagerCommentsList = {
  readonly items?: Comment[] | null;
}

type LazyCommentsList = {
  readonly items?: Comment[] | null;
}

export declare type CommentsList = LazyLoading extends LazyLoadingDisabled ? EagerCommentsList : LazyCommentsList

export declare const CommentsList: (new (init: ModelInit<CommentsList>) => CommentsList)

type EagerNotificationsList = {
  readonly items?: Notification[] | null;
}

type LazyNotificationsList = {
  readonly items?: Notification[] | null;
}

export declare type NotificationsList = LazyLoading extends LazyLoadingDisabled ? EagerNotificationsList : LazyNotificationsList

export declare const NotificationsList: (new (init: ModelInit<NotificationsList>) => NotificationsList)

type EagerIndividualHistoryList = {
  readonly items?: IndividualHistory[] | null;
}

type LazyIndividualHistoryList = {
  readonly items?: IndividualHistory[] | null;
}

export declare type IndividualHistoryList = LazyLoading extends LazyLoadingDisabled ? EagerIndividualHistoryList : LazyIndividualHistoryList

export declare const IndividualHistoryList: (new (init: ModelInit<IndividualHistoryList>) => IndividualHistoryList)

type EagerGenericResult = {
  readonly result: string;
}

type LazyGenericResult = {
  readonly result: string;
}

export declare type GenericResult = LazyLoading extends LazyLoadingDisabled ? EagerGenericResult : LazyGenericResult

export declare const GenericResult: (new (init: ModelInit<GenericResult>) => GenericResult)

