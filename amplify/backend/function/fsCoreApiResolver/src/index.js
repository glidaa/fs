/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* Amplify Params - DO NOT EDIT
  API_FSCOREAPI_GRAPHQLAPIENDPOINTOUTPUT
  API_FSCOREAPI_GRAPHQLAPIIDOUTPUT
  AUTH_FSCOGNITO_USERPOOLID
  ENV
  REGION
Amplify Params - DO NOT EDIT */

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
require('dotenv').config();

const {
  SENDGRID_API_KEY,
  RDS_HOST,
  RDS_USER,
  RDS_PASSWORD,
  API_FSCOREAPI_GRAPHQLAPIENDPOINTOUTPUT: APIURL,
  AUTH_FSCOGNITO_USERPOOLID: USERPOOL,
  REGION,
} = process.env;

const AWS = require('aws-sdk');
const sgMail = require('@sendgrid/mail');
const http = require('http');
const https = require('https');
const UrlParse = require('url').URL;
const { customAlphabet } = require('nanoid');
const mariadb = require('mariadb');
const { randomUUID } = require('crypto');
const getEmailContent = require('./email').getContent;

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 36);

const s3 = new AWS.S3();

const cognitoClient = new AWS.CognitoIdentityServiceProvider();
sgMail.setApiKey(SENDGRID_API_KEY);

const UNAUTHORIZED = 'UNAUTHORIZED';
const USER_NOT_FOUND = 'USER_NOT_FOUND';
const PROJECT_NOT_FOUND = 'PROJECT_NOT_FOUND';
const ALREADY_EXISTS = 'ALREADY_EXISTS';
const UNSUPPORTED_PROVIDER = 'UNSUPPORTED_PROVIDER';
const METADATA_FETCH_ERROR = 'METADATA_FETCH_ERROR';

const pool = mariadb.createPool({
  host: RDS_HOST,
  user: RDS_USER,
  password: RDS_PASSWORD,
  database: 'forwardslash',
  connectionLimit: 5,
});

exports.handler = async (ctx) => {
  const resolvers = {
    Mutation: {
      pushNotification: pushData,
      pushUserUpdate: pushData,
      uploadExternal,
      createProject,
      createTask,
      createComment,
      updateProject,
      updateProjectTitle,
      updateTaskRank,
      updateTaskTask,
      updateTaskDescription,
      updateTaskTags,
      updateTaskDue,
      updateTaskStatus,
      updateTaskPriority,
      updateUser,
      deleteProjectAndTasks,
      deleteTaskAndComments,
      deleteComment,
      dismissNotification,
      dismissNotifications,
      addAssignee,
      removeAssignee,
      addAnonymousAssignee,
      removeAnonymousAssignee,
      addInvitedAssignee,
      removeInvitedAssignee,
      addWatcher,
      removeWatcher,
      importLocalData,
    },
    Query: {
      initializeUpload,
      listAttachmentsByTaskId,
      getUserByUsername,
      searchUserToAssign,
      searchUserToWatch,
      listUsersByUsernames,
      getProjectById,
      getProjectByPermalink,
      listOwnedProjects,
      listAssignedProjects,
      listWatchedProjects,
      listTasksForProject,
      listCommentsForTask,
      listNotifications,
      listHistoryByTaskId,
    },
    Subscription: {
      onPushNotification,
      onPushUserUpdate,
      onDismissNotification,
      onCreateOwnedProject,
      onUpdateOwnedProject,
      onDeleteOwnedProject,
      onUpdateProject,
      onDeleteProject,
      onCreateTaskByProjectId,
      onUpdateTaskByProjectId,
      onDeleteTaskByProjectId,
      onCreateCommentByTaskId,
      onDeleteCommentByTaskId,
    },
  };

  const typeHandler = resolvers[ctx.typeName];
  if (typeHandler) {
    const resolver = typeHandler[ctx.fieldName];
    if (resolver) {
      try {
        return await resolver(ctx);
      } catch (err) {
        throw new Error(err);
      }
    }
  }
  throw new Error('Resolver not found.');

  async function isProjectSharedWithClient(projectId, client) {
    const query = 'CALL is_project_shared_with_client(?, ?, ?)';
    const params = [projectId, client, null];
    try {
      const data = (await pool.execute(query, params))[0];
      return data[0].shared === 1;
    } catch (err) {
      throw new Error(err);
    }
  }

  async function isTaskSharedWithClient(taskId, client) {
    const query = 'CALL is_task_shared_with_client(?, ?, ?)';
    const params = [taskId, client, null];
    try {
      const data = (await pool.execute(query, params))[0];
      return data[0].shared === 1;
    } catch (err) {
      throw new Error(err);
    }
  }

  async function pushData(ctx) {
    try {
      return ctx.arguments.input;
    } catch (err) {
      throw new Error(err);
    }
  }

  async function initializeUpload(ctx) {
    try {
      const client = ctx.identity.username;
      const { contentType, taskId } = ctx.arguments;
      const query = 'CALL get_project_of_task(?, ?, ?, ?)';
      const params = [taskId, client, null, null];
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, owner } = data[0];
      const presignedUrl = s3.getSignedUrl('putObject', {
        Bucket: 'fs-attachments',
        Key: `${owner}/${projectId}/${taskId}/${randomUUID()}`,
        ContentType: contentType,
        Expires: 60 * 60 * 24,
      });
      return { presignedUrl };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function uploadExternal(ctx) {
    try {
      const client = ctx.identity.username;
      const { url, taskId } = ctx.arguments;
      const query = 'CALL get_project_of_task(?, ?, ?, ?)';
      const params = [taskId, client, null, null];
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, owner } = data[0];
      const parsedUrl = new UrlParse(url);
      const youtubeRe = /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
      const loomRe = /https:\/\/([\w.-]+\.)?loom.com\/(share|embed)\/(\w+)/i;
      const figmaRe = /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/i;
      let provider = null;
      let contentId = null;
      if (youtubeRe.test(url)) {
        provider = 'youtube';
        [,,,,,,,, contentId] = url.match(youtubeRe);
      } else if (loomRe.test(url)) {
        provider = 'loom';
        [,,, contentId] = url.match(loomRe);
      } else if (figmaRe.test(url)) {
        provider = 'figma';
        [,,, contentId] = url.match(figmaRe);
      }
      if (provider) {
        const title = await new Promise((resolve, reject) => {
          https.get(parsedUrl, (res) => {
            let content = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
              content += chunk;
            });

            res.on('end', () => {
              let title = null;
              if (provider === 'youtube') {
                title = /<meta name="twitter:title" content="(.*?)">/.exec(content)?.[1];
              } else if (provider === 'loom') {
                title = /"folder_id":"\w+?","name":"(.*)","cta":{"url":/.exec(content)?.[1];
              } else if (provider === 'figma') {
                title = /<meta name="twitter:title" content="(.*?)">/.exec(content)?.[1];
              }
              resolve(title);
            });
          }).on('error', () => {
            reject(METADATA_FETCH_ERROR);
          });
        });
        if (!title) throw new Error(METADATA_FETCH_ERROR);
        await s3.upload({
          Bucket: 'fs-attachments',
          Key: `${owner}/${projectId}/${taskId}/${provider}-${contentId}`,
          ContentType: `embed/${provider}`,
          ContentDisposition: `inline; filename="[${contentId}](${encodeURIComponent(title)})"`,
          Body: '',
        }).promise();
        return { success: true };
      }
      throw new Error(UNSUPPORTED_PROVIDER);
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listAttachmentsByTaskId(ctx) {
    try {
      const client = ctx.identity.sub ? ctx.identity.username : '';
      const { taskId } = ctx.arguments;
      const query = 'CALL get_project_of_task(?, ?, ?, ?)';
      const params = [taskId, client, null, null];
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, owner } = data[0];
      const files = await s3.listObjectsV2({
        Bucket: 'fs-attachments',
        Prefix: `${owner}/${projectId}/${taskId}`,
      }).promise();
      const uploads = files.Contents.map(async (file) => {
        const fileData = s3.headObject({
          Bucket: 'fs-attachments',
          Key: file.Key,
        }).promise();
        const data = await fileData;
        return ({
          id: /\/([^/]+)$/.exec(file.Key)[1],
          filename: decodeURIComponent(/.*?filename="(.*)"$/.exec(data.ContentDisposition)[1]),
          contentType: data.ContentType,
          size: data.ContentLength,
          url: s3.getSignedUrl('getObject', {
            Bucket: 'fs-attachments',
            Key: file.Key,
          }),
        });
      });
      return { items: await Promise.all(uploads) || [] };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function getUserByUsername(ctx) {
    const query = 'CALL get_user_by_username(?)';
    const params = [ctx.arguments.username];
    try {
      const data = (await pool.execute(query, params))[0];
      if (data.length) {
        return data[0];
      }
      throw new Error(USER_NOT_FOUND);
    } catch (err) {
      throw new Error(err);
    }
  }

  async function createProject(ctx) {
    const client = ctx.identity.username;
    if (client) {
      const {
        id: projectId,
        permalink,
        rank,
        title,
        privacy,
        permissions,
        statusSet,
        defaultStatus,
        mutationId,
      } = ctx.arguments.input;
      const statusSetWithProjectId = statusSet.map((x) => ({ ...x, project_id: projectId }));
      const query = 'CALL create_project(?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const params = [
        projectId,
        permalink,
        rank,
        title,
        privacy,
        permissions,
        JSON.stringify(statusSetWithProjectId),
        defaultStatus,
        client,
      ];
      try {
        await pool.execute(query, params);
        return {
          id: projectId,
          permalink,
          rank,
          title,
          privacy,
          permissions,
          statusSet,
          defaultStatus,
          totalTasks: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          owner: client,
          mutationId,
        };
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED);
    }
  }

  async function createTask(ctx) {
    const client = ctx.identity.username;
    if (client) {
      const {
        id: taskId,
        projectId,
        rank,
        task,
        description,
        due,
        tags,
        status,
        priority,
        mutationId,
      } = ctx.arguments.input;
      const formattedDue = due ? new Date(due).toISOString().slice(0, 19).replace('T', ' ') : '0000-00-00 00:00:00';
      const query = 'CALL create_task(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const params = [
        taskId,
        projectId,
        rank,
        task,
        description,
        formattedDue,
        tags,
        status,
        priority,
        client,
      ];
      try {
        const { permalink } = (await pool.execute(query, params))[0][0];
        return {
          id: taskId,
          projectId,
          permalink,
          rank,
          task,
          description,
          due,
          tags,
          status,
          priority,
          assignees: [],
          anonymousAssignees: [],
          invitedAssignees: [],
          watchers: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          owner: client,
          mutationId,
        };
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED);
    }
  }

  async function createComment(ctx) {
    const client = ctx.identity.username;
    if (client) {
      const {
        id: commentId,
        taskId,
        content,
        mutationId,
      } = ctx.arguments.input;
      const query = 'CALL create_comment(?, ?, ?, ?, ?)';
      const params = [commentId, taskId, content, client, mutationId];
      try {
        const data = (await pool.execute(query, params))[0];
        const { project_id: projectId, hint, task_permalink: taskPermalink } = data[0];
        const recipients = JSON.parse(data[0].recipients);
        const notificationTemplate = {
          projectId,
          taskId,
          commentId,
          action: 'create',
          field: 'comment',
          value: content,
          hint,
          read: false,
          link: taskPermalink,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          mutator: client,
        };
        await pushNotification(notificationTemplate, recipients);
        const recipientsData = await _fetchRecipientsData(Object.keys(recipients));
        const watchersEmails = recipientsData.map(({ email }) => email);
        const emailToBeSentToWatchers = getEmailContent('commentation', {
          UPDATER_USERNAME: client,
          TASK: hint || '',
          NEW_VALUE: content,
          TASK_PERMALINK: `https://forwardslash.ch/${taskPermalink}`,
        });
        if (watchersEmails.length) {
          await sgMail.sendMultiple({
            to: [...watchersEmails],
            from: 'notify@forwardslash.ch',
            subject: emailToBeSentToWatchers.subject,
            html: emailToBeSentToWatchers.body,
          });
        }
        return {
          id: commentId,
          taskId,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          owner: client,
          mutationId,
        };
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED);
    }
  }

  async function updateProject(ctx) {
    const client = ctx.identity.username;
    const {
      id: projectId,
      permalink,
      rank,
      title,
      privacy,
      permissions,
      statusSet,
      defaultStatus,
      mutationId,
    } = ctx.arguments.input;
    const statusSetWithProjectId = statusSet.map((x) => ({ ...x, project_id: projectId }));
    const query = 'CALL update_project(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [
      projectId,
      permalink,
      rank,
      title,
      privacy,
      permissions,
      JSON.stringify(statusSetWithProjectId),
      defaultStatus,
      client,
      mutationId,
      null,
    ];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_owner: projectOwner } = data[0];
      return {
        id: projectId,
        permalink,
        rank,
        title,
        privacy,
        permissions,
        statusSet,
        defaultStatus,
        updatedAt: new Date().toISOString(),
        owner: projectOwner,
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function updateProjectTitle(ctx) {
    const client = ctx.identity.username;
    const {
      id: projectId,
      title,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL update_project_title(?, ?, ?, ?, ?)';
    const params = [
      projectId,
      title,
      client,
      mutationId,
      null,
    ];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_owner: projectOwner } = data[0];
      return {
        id: projectId,
        title,
        updatedAt: new Date().toISOString(),
        owner: projectOwner,
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function updateTaskRank(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      rank: newRank,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL update_task_rank(?, ?, ?, ?, ?, ?)';
    const params = [taskId, newRank, client, mutationId, null, null];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId } = data[0];
      return {
        id: taskId,
        projectId,
        action: 'update',
        field: 'rank',
        value: newRank,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function updateTaskTask(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      task: newTask,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL update_task_task(?, ?, ?, ?, ?, ?)';
    const params = [taskId, newTask, client, mutationId, null, null];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId } = data[0];
      return {
        id: taskId,
        projectId,
        action: 'update',
        field: 'task',
        value: newTask,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function updateTaskDescription(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      description: newDescription,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL update_task_description(?, ?, ?, ?, ?, ?)';
    const params = [taskId, newDescription, client, mutationId, null, null];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId } = data[0];
      return {
        id: taskId,
        projectId,
        action: 'update',
        field: 'description',
        value: newDescription,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function updateTaskDue(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      due: newDue,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL update_task_due(?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const formattedNewDue = newDue ? new Date(newDue).toISOString().slice(0, 19).replace('T', ' ') : '0000-00-00 00:00:00';
    const params = [taskId, formattedNewDue, client, mutationId, null, null, null, null, null];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, hint, task_permalink: taskPermalink } = data[0];
      const recipients = JSON.parse(data[0].recipients);
      const notificationTemplate = {
        projectId,
        taskId,
        commentId: null,
        action: 'update',
        field: 'due',
        value: newDue,
        hint,
        read: false,
        link: taskPermalink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mutator: client,
      };
      await pushNotification(notificationTemplate, recipients);
      const recipientsData = await _fetchRecipientsData(Object.keys(recipients));
      const watchersEmails = recipientsData.map(({ email }) => email);
      const emailToBeSentToWatchers = getEmailContent('dueUpdate', {
        UPDATER_USERNAME: client,
        TASK: hint || '',
        NEW_VALUE: new Date(newDue).toLocaleDateString(),
        TASK_PERMALINK: `https://forwardslash.ch/${taskPermalink}`,
      });
      if (watchersEmails.length) {
        await sgMail.sendMultiple({
          to: [...watchersEmails],
          from: 'notify@forwardslash.ch',
          subject: emailToBeSentToWatchers.subject,
          html: emailToBeSentToWatchers.body,
        });
      }
      return {
        id: taskId,
        projectId,
        action: 'update',
        field: 'due',
        value: newDue,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function updateTaskTags(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      tags: newTags,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL update_task_tags(?, ?, ?, ?, ?, ?)';
    const params = [taskId, newTags, client, mutationId, null, null];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId } = data[0];
      return {
        id: taskId,
        projectId,
        action: 'update',
        field: 'tags',
        value: JSON.stringify(newTags),
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function updateTaskStatus(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      status: newStatus,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL update_task_status(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [taskId, newStatus, client, mutationId, null, null, null, null, null, null];
    try {
      const data = (await pool.execute(query, params))[0];
      const {
        project_id: projectId,
        hint,
        task_permalink: taskPermalink,
        new_status_title: newStatusTitle,
      } = data[0];
      const recipients = JSON.parse(data[0].recipients);
      const notificationTemplate = {
        projectId,
        taskId,
        commentId: null,
        action: 'update',
        field: 'status',
        value: newStatus,
        hint,
        read: false,
        link: taskPermalink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mutator: client,
      };
      await pushNotification(notificationTemplate, recipients);
      const recipientsData = await _fetchRecipientsData(Object.keys(recipients));
      const watchersEmails = recipientsData.map(({ email }) => email);
      const emailToBeSentToWatchers = getEmailContent('statusUpdate', {
        UPDATER_USERNAME: client,
        TASK: hint || '',
        NEW_VALUE: newStatusTitle,
        TASK_PERMALINK: `https://forwardslash.ch/${taskPermalink}`,
      });
      if (watchersEmails.length) {
        await sgMail.sendMultiple({
          to: [...watchersEmails],
          from: 'notify@forwardslash.ch',
          subject: emailToBeSentToWatchers.subject,
          html: emailToBeSentToWatchers.body,
        });
      }
      return {
        id: taskId,
        projectId,
        action: 'update',
        field: 'status',
        value: newStatus,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function updateTaskPriority(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      priority: newPriority,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL update_task_priority(?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [taskId, newPriority, client, mutationId, null, null, null, null, null];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, hint, task_permalink: taskPermalink } = data[0];
      const recipients = JSON.parse(data[0].recipients);
      const notificationTemplate = {
        projectId,
        taskId,
        commentId: null,
        action: 'update',
        field: 'priority',
        value: newPriority,
        hint,
        read: false,
        link: taskPermalink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mutator: client,
      };
      await pushNotification(notificationTemplate, recipients);
      const recipientsData = await _fetchRecipientsData(Object.keys(recipients));
      const watchersEmails = recipientsData.map(({ email }) => email);
      const emailToBeSentToWatchers = getEmailContent('priorityUpdate', {
        UPDATER_USERNAME: client,
        TASK: hint || '',
        NEW_VALUE: newPriority,
        TASK_PERMALINK: `https://forwardslash.ch/${taskPermalink}`,
      });
      if (watchersEmails.length) {
        await sgMail.sendMultiple({
          to: [...watchersEmails],
          from: 'notify@forwardslash.ch',
          subject: emailToBeSentToWatchers.subject,
          html: emailToBeSentToWatchers.body,
        });
      }
      return {
        id: taskId,
        projectId,
        action: 'update',
        field: 'priority',
        value: newPriority,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function updateUser(ctx) {
    const updateData = ctx.arguments.input;
    const { username } = updateData;
    const client = ctx.identity.username;
    if (client === username) {
      const {
        firstName: newFirstName,
        lastName: newLastName,
      } = updateData;
      const UpdateUserCognitoParams = {
        UserAttributes: [
          {
            Name: 'given_name',
            Value: updateData.firstName,
          },
          {
            Name: 'family_name',
            Value: updateData.lastName,
          },
        ],
        UserPoolId: USERPOOL,
        Username: username,
      };
      const query = 'CALL update_user(?, ?, ?)';
      const params = [username, newFirstName, newLastName];
      try {
        await cognitoClient.adminUpdateUserAttributes(UpdateUserCognitoParams).promise();
        await pool.execute(query, params);
        await pushUserUpdate({
          username,
          firstName: newFirstName,
          lastName: newLastName,
        });
        return {
          username,
          firstName: newFirstName,
          lastName: newLastName,
          updatedAt: new Date().toISOString(),
        };
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED);
    }
  }

  async function addAssignee(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      assignee,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL add_assignee(?, ?, ?, ?)';
    const params = [taskId, assignee, client, mutationId];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, hint, task_permalink: taskPermalink } = data[0];
      const recipients = JSON.parse(data[0].recipients);
      const notificationTemplate = {
        projectId,
        taskId,
        commentId: null,
        action: 'append',
        field: 'assignees',
        value: assignee,
        hint,
        read: false,
        link: taskPermalink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mutator: client,
      };
      await pushNotification(notificationTemplate, recipients);
      const recipientsData = await _fetchRecipientsData(Object.keys(recipients));
      const assigneeData = recipientsData
        .splice(recipientsData.findIndex((recipient) => recipient.username === assignee), 1)[0];
      const watchersEmails = recipientsData.map(({ email }) => email);
      const emailToBeSentToAssignee = getEmailContent('assignment', {
        ASSIGNEE_FIRST_NAME: assigneeData.firstName,
        ASSIGNER_USERNAME: client,
        TASK: hint || '',
        TASK_PERMALINK: `https://forwardslash.ch/${taskPermalink}`,
      });
      const emailToBeSentToWatchers = getEmailContent('assignmentWatching', {
        ASSIGNEE_USERNAME: assigneeData.username,
        ASSIGNER_USERNAME: client,
        TASK: hint || '',
        TASK_PERMALINK: `https://forwardslash.ch/${taskPermalink}`,
      });
      await sgMail.send({
        to: assigneeData.email,
        from: 'notify@forwardslash.ch',
        subject: emailToBeSentToAssignee.subject,
        html: emailToBeSentToAssignee.body,
      });
      if (watchersEmails.length) {
        await sgMail.sendMultiple({
          to: [...watchersEmails],
          from: 'notify@forwardslash.ch',
          subject: emailToBeSentToWatchers.subject,
          html: emailToBeSentToWatchers.body,
        });
      }
      return {
        id: taskId,
        projectId,
        action: 'append',
        field: 'assignees',
        value: assignee,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Error(ALREADY_EXISTS);
      }
      throw new Error(err);
    }
  }

  async function removeAssignee(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      assignee,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL remove_assignee(?, ?, ?, ?)';
    const params = [taskId, assignee, client, mutationId];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, hint, task_permalink: taskPermalink } = data[0];
      const recipients = JSON.parse(data[0].recipients);
      const notificationTemplate = {
        projectId,
        taskId,
        commentId: null,
        action: 'remove',
        field: 'assignees',
        value: assignee,
        hint,
        read: false,
        link: taskPermalink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mutator: client,
      };
      await pushNotification(notificationTemplate, recipients);
      return {
        id: taskId,
        projectId,
        action: 'remove',
        field: 'assignees',
        value: assignee,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function addAnonymousAssignee(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      assignee,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL add_anonymous_assignee(?, ?, ?, ?)';
    const params = [taskId, assignee, client, mutationId];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, hint, task_permalink: taskPermalink } = data[0];
      const recipients = JSON.parse(data[0].recipients);
      const notificationTemplate = {
        projectId,
        taskId,
        commentId: null,
        action: 'append',
        field: 'anonymousAssignees',
        value: assignee,
        hint,
        read: false,
        link: taskPermalink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mutator: client,
      };
      await pushNotification(notificationTemplate, recipients);
      const recipientsData = await _fetchRecipientsData(Object.keys(recipients));
      const watchersEmails = recipientsData.map(({ email }) => email);
      const emailToBeSentToWatchers = getEmailContent('anonymousAssignmentWatching', {
        ASSIGNEE_NAME: assignee,
        ASSIGNER_USERNAME: client,
        TASK: hint || '',
        TASK_PERMALINK: `https://forwardslash.ch/${taskPermalink}`,
      });
      if (watchersEmails.length) {
        await sgMail.sendMultiple({
          to: [...watchersEmails],
          from: 'notify@forwardslash.ch',
          subject: emailToBeSentToWatchers.subject,
          html: emailToBeSentToWatchers.body,
        });
      }
      return {
        id: taskId,
        projectId,
        action: 'append',
        field: 'anonymousAssignees',
        value: assignee,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Error(ALREADY_EXISTS);
      }
      throw new Error(err);
    }
  }

  async function removeAnonymousAssignee(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      assignee,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL remove_anonymous_assignee(?, ?, ?, ?)';
    const params = [taskId, assignee, client, mutationId];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, hint, task_permalink: taskPermalink } = data[0];
      const recipients = JSON.parse(data[0].recipients);
      const notificationTemplate = {
        projectId,
        taskId,
        commentId: null,
        action: 'remove',
        field: 'anonymousAssignees',
        value: assignee,
        hint,
        read: false,
        link: taskPermalink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mutator: client,
      };
      await pushNotification(notificationTemplate, recipients);
      return {
        id: taskId,
        projectId,
        action: 'remove',
        field: 'anonymousAssignees',
        value: assignee,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function addInvitedAssignee(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      assignee,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL add_invited_assignee(?, ?, ?, ?)';
    const params = [taskId, assignee, client, mutationId];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, hint, task_permalink: taskPermalink } = data[0];
      const recipients = JSON.parse(data[0].recipients);
      const notificationTemplate = {
        projectId,
        taskId,
        commentId: null,
        action: 'append',
        field: 'invitedAssignees',
        value: assignee,
        hint,
        read: false,
        link: taskPermalink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mutator: client,
      };
      await pushNotification(notificationTemplate, recipients);
      const recipientsData = await _fetchRecipientsData(Object.keys(recipients));
      const watchersEmails = recipientsData.map(({ email }) => email);
      const emailToBeSentToAssignee = getEmailContent('invitation', {
        ASSIGNEE_EMAIL: assignee,
        ASSIGNER_USERNAME: client,
        TASK: hint || '',
        TASK_PERMALINK: `https://forwardslash.ch/${taskPermalink}`,
      });
      const emailToBeSentToWatchers = getEmailContent('invitationWatching', {
        ASSIGNEE_EMAIL: assignee,
        ASSIGNER_USERNAME: client,
        TASK: hint || '',
        TASK_PERMALINK: `https://forwardslash.ch/${taskPermalink}`,
      });
      await sgMail.send({
        to: assignee,
        from: 'notify@forwardslash.ch',
        subject: emailToBeSentToAssignee.subject,
        html: emailToBeSentToAssignee.body,
      });
      if (watchersEmails.length) {
        await sgMail.sendMultiple({
          to: [...watchersEmails],
          from: 'notify@forwardslash.ch',
          subject: emailToBeSentToWatchers.subject,
          html: emailToBeSentToWatchers.body,
        });
      }
      return {
        id: taskId,
        projectId,
        action: 'append',
        field: 'invitedAssignees',
        value: assignee,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Error(ALREADY_EXISTS);
      }
      throw new Error(err);
    }
  }

  async function removeInvitedAssignee(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      assignee,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL remove_invited_assignee(?, ?, ?, ?)';
    const params = [taskId, assignee, client, mutationId];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, hint, task_permalink: taskPermalink } = data[0];
      const recipients = JSON.parse(data[0].recipients);
      const notificationTemplate = {
        projectId,
        taskId,
        commentId: null,
        action: 'remove',
        field: 'invitedAssignees',
        value: assignee,
        hint,
        read: false,
        link: taskPermalink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mutator: client,
      };
      await pushNotification(notificationTemplate, recipients);
      return {
        id: taskId,
        projectId,
        action: 'remove',
        field: 'invitedAssignees',
        value: assignee,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function addWatcher(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      watcher,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL add_watcher(?, ?, ?, ?)';
    const params = [taskId, watcher, client, mutationId];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, hint, task_permalink: taskPermalink } = data[0];
      const recipients = JSON.parse(data[0].recipients);
      const notificationTemplate = {
        projectId,
        taskId,
        commentId: null,
        action: 'append',
        field: 'watchers',
        value: watcher,
        hint,
        read: false,
        link: taskPermalink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mutator: client,
      };
      await pushNotification(notificationTemplate, recipients);
      const recipientsData = await _fetchRecipientsData(Object.keys(recipients));
      const watcherData = recipientsData
        .splice(recipientsData.findIndex((recipient) => recipient.username === watcher), 1)[0];
      const watchersEmails = recipientsData.map(({ email }) => email);
      const emailToBeSentToWatcher = getEmailContent('addingWatcher', {
        WATCHER_FIRST_NAME: watcherData.firstName,
        ADDER_USERNAME: client,
        TASK: hint || '',
        TASK_PERMALINK: `https://forwardslash.ch/${taskPermalink}`,
      });
      const emailToBeSentToWatchers = getEmailContent('addingWatcherWatching', {
        WATCHER_USERNAME: watcherData.username,
        ADDER_USERNAME: client,
        TASK: hint || '',
        TASK_PERMALINK: `https://forwardslash.ch/${taskPermalink}`,
      });
      await sgMail.send({
        to: watcherData.email,
        from: 'notify@forwardslash.ch',
        subject: emailToBeSentToWatcher.subject,
        html: emailToBeSentToWatcher.body,
      });
      if (watchersEmails.length) {
        await sgMail.sendMultiple({
          to: [...watchersEmails],
          from: 'notify@forwardslash.ch',
          subject: emailToBeSentToWatchers.subject,
          html: emailToBeSentToWatchers.body,
        });
      }
      return {
        id: taskId,
        projectId,
        action: 'append',
        field: 'watchers',
        value: watcher,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Error(ALREADY_EXISTS);
      }
      throw new Error(err);
    }
  }

  async function removeWatcher(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      watcher,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL remove_watcher(?, ?, ?, ?)';
    const params = [taskId, watcher, client, mutationId];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId, hint, task_permalink: taskPermalink } = data[0];
      const recipients = JSON.parse(data[0].recipients);
      const notificationTemplate = {
        projectId,
        taskId,
        commentId: null,
        action: 'remove',
        field: 'watchers',
        value: watcher,
        hint,
        read: false,
        link: taskPermalink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mutator: client,
      };
      await pushNotification(notificationTemplate, recipients);
      return {
        id: taskId,
        projectId,
        action: 'remove',
        field: 'watchers',
        value: watcher,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function getProjectById(ctx) {
    const client = ctx.identity.sub ? ctx.identity.username : '';
    const query = 'CALL get_project_by_id(?, ?)';
    const params = [ctx.arguments.projectId, client];
    try {
      const data = (await pool.execute(query, params))[0];
      if (data.length) {
        return data[0];
      }
      throw new Error(PROJECT_NOT_FOUND);
    } catch (err) {
      throw new Error(err);
    }
  }

  async function getProjectByPermalink(ctx) {
    const client = ctx.identity.sub ? ctx.identity.username : '';
    const { owner, permalink } = ctx.arguments;
    const query = 'CALL get_project_by_permalink(?, ?, ?)';
    const params = [permalink, owner, client];
    try {
      const data = (await pool.execute(query, params))[0];
      if (data.length) {
        return data[0];
      }
      throw new Error(PROJECT_NOT_FOUND);
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listNotifications(ctx) {
    const client = ctx.identity.username;
    const query = 'CALL list_notifications(?)';
    const params = [client];
    try {
      const data = (await pool.execute(query, params))[0];
      return { items: data || [] };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listHistoryByTaskId(ctx) {
    const client = ctx.identity.sub ? ctx.identity.username : '';
    const { taskId } = ctx.arguments;
    const query = 'CALL list_history_by_task_id(?, ?)';
    const params = [taskId, client];
    try {
      const data = (await pool.execute(query, params))[0];
      return { items: data || [] };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listOwnedProjects(ctx) {
    const client = ctx.identity.username;
    const { owner } = ctx.arguments;
    const query = 'CALL list_projects_by_owner(?, ?)';
    const params = [owner || client, client];
    try {
      const data = (await pool.execute(query, params))[0];
      return { items: data || [] };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listAssignedProjects(ctx) {
    const client = ctx.identity.username;
    const { assignee } = ctx.arguments;
    const query = 'CALL list_assigned_projects(?, ?)';
    const params = [assignee || client, client];
    try {
      const data = (await pool.execute(query, params))[0];
      return { items: data || [] };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listWatchedProjects(ctx) {
    const client = ctx.identity.username;
    const { watcher } = ctx.arguments;
    const query = 'CALL list_watched_projects(?, ?)';
    const params = [watcher || client, client];
    try {
      const data = (await pool.execute(query, params))[0];
      return { items: data || [] };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listUsersByUsernames(ctx) {
    const usernames = [...new Set(ctx.arguments.usernames)];
    if (usernames.length) {
      let query = 'SELECT `users`.`username`, '
      + "`users`.`first_name` AS 'firstName', "
      + "`users`.`last_name` AS 'lastName', "
      + '`users`.`email`, '
      + "`users`.`created_at` AS 'createdAt', "
      + "`users`.`updated_at` AS 'updatedAt' "
      + 'FROM users WHERE username IN (';
      for (let i = 0; i < usernames.length; i++) {
        query += '?';
        if (i < usernames.length - 1) {
          query += ', ';
        }
      }
      query += ')';
      try {
        const data = await pool.execute(query, usernames);
        return { items: data || [] };
      } catch (err) {
        throw new Error(err);
      }
    }
    return { items: [] };
  }

  async function searchUserToAssign(ctx) {
    try {
      const { searchQuery, taskId } = ctx.arguments;
      const query = 'CALL search_user_to_assign(?, ?)';
      const params = [searchQuery, taskId];
      const data = (await pool.execute(query, params))[0];
      return { items: data || [] };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function searchUserToWatch(ctx) {
    try {
      const { searchQuery, taskId } = ctx.arguments;
      const query = 'CALL search_user_to_watch(?, ?)';
      const params = [searchQuery, taskId];
      const data = (await pool.execute(query, params))[0];
      return { items: data || [] };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listTasksForProject(ctx) {
    const client = ctx.identity.sub ? ctx.identity.username : '';
    const { projectId } = ctx.arguments;
    const query = 'CALL list_tasks_by_project_id(?, ?)';
    const params = [projectId, client];
    try {
      const data = (await pool.execute(query, params))[0];
      return { items: data || [] };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listCommentsForTask(ctx) {
    const client = ctx.identity.sub ? ctx.identity.username : '';
    const { taskId } = ctx.arguments;
    const query = 'CALL list_comments_by_task_id(?, ?)';
    const params = [taskId, client];
    try {
      const data = (await pool.execute(query, params))[0];
      return { items: data || [] };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function deleteComment(ctx) {
    const client = ctx.identity.username;
    const {
      id: commentId,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL delete_comment(?, ?, ?)';
    const params = [commentId, client, null];
    try {
      const data = (await pool.execute(query, params))[0];
      const { task_id: taskId } = data[0];
      return {
        id: commentId,
        taskId,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function dismissNotification(ctx) {
    const { id: notificationId, mutationId } = ctx.arguments.input;
    const client = ctx.identity.username;
    const query = 'CALL dismiss_notification(?, ?)';
    const params = [notificationId, client];
    try {
      await pool.execute(query, params);
      return {
        id: notificationId,
        updatedAt: new Date().toISOString(),
        owner: client,
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function dismissNotifications(ctx) {
    const client = ctx.identity.username;
    const query = 'CALL dismiss_notifications(?)';
    const params = [client];
    try {
      await pool.execute(query, params);
      return {
        items: [],
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function deleteProjectAndTasks(ctx) {
    const client = ctx.identity.username;
    const {
      id: projectId,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL delete_project(?, ?, ?)';
    const params = [projectId, client, null];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_owner: projectOwner } = data[0];
      return {
        id: projectId,
        updatedAt: new Date().toISOString(),
        owner: projectOwner,
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function deleteTaskAndComments(ctx) {
    const client = ctx.identity.username;
    const {
      id: taskId,
      mutationId,
    } = ctx.arguments.input;
    const query = 'CALL delete_task(?, ?, ?)';
    const params = [taskId, client, null];
    try {
      const data = (await pool.execute(query, params))[0];
      const { project_id: projectId } = data[0];
      return {
        id: taskId,
        projectId,
        updatedAt: new Date().toISOString(),
        mutationId,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async function importLocalData(ctx) {
    const client = ctx.identity.username;
    const localData = ctx.arguments.input;
    if (localData) {
      const conn = await pool.getConnection();
      try {
        conn.beginTransaction();
        const lastRankQuery = 'SELECT IFNULL(MAX(rank), 0) AS max_rank FROM projects WHERE owner = ?';
        const lastRankParams = [client];
        let lastRank = (await conn.query(lastRankQuery, lastRankParams))[0].max_rank;
        for (const project of localData) {
          lastRank = (lastRank + Number.MAX_SAFE_INTEGER) / 2;
          let projectId = project.id;
          const idQuery = 'SELECT id FROM projects WHERE id = ?';
          while ((await conn.query(idQuery, [projectId]))[0]) {
            projectId = nanoid();
          }
          const {
            permalink,
            title,
            privacy,
            permissions,
            statusSet,
            defaultStatus,
            tasks,
          } = project;
          const statusSetWithProjectId = statusSet.map((x) => ({ ...x, project_id: projectId }));
          const query = 'CALL create_project_unsafe(?, ?, ?, ?, ?, ?, ?, ?, ?)';
          const params = [
            projectId,
            permalink,
            lastRank,
            title,
            privacy,
            permissions,
            JSON.stringify(statusSetWithProjectId),
            defaultStatus,
            client,
          ];
          await conn.query(query, params);
          for (const taskObj of tasks) {
            const {
              id: taskId,
              rank,
              task,
              description,
              due,
              tags,
              status,
              priority,
              anonymousAssignees,
            } = taskObj;
            const formattedDue = due ? new Date(due).toISOString().slice(0, 19).replace('T', ' ') : '0000-00-00 00:00:00';
            const query = 'CALL create_task_unsafe(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const params = [
              taskId,
              projectId,
              rank,
              task,
              description,
              formattedDue,
              JSON.stringify(tags),
              status,
              priority,
              client,
            ];
            await conn.query(query, params);
            if (anonymousAssignees.length) {
              const query = 'INSERT INTO tasks_anonymous_assignees (task_id, assignee) VALUES (?, ?)';
              conn.batch(query, anonymousAssignees.map((x) => [taskId, x]));
            }
          }
        }
        conn.commit();
        conn.release();
      } catch (err) {
        conn.rollback();
        conn.release();
        throw new Error('IMPORT_FAILED');
      }
    }
    return {
      result: 'IMPORT_SUCCESS',
    };
  }

  async function onCreateOwnedProject(ctx) {
    const client = ctx.identity.username;
    const { owner } = ctx.arguments;
    if (client === owner) {
      return {
        id: '00000000-0000-0000-0000-000000000000',
        permalink: 'dummy-project',
        rank: 0,
        title: 'Dummy Project',
        privacy: 'public',
        permissions: 'rw',
        statusSet: [],
        defaultStatus: '00000000-0000-0000-0000-000000000000',
        totalTasks: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner,
      };
    }
    throw new Error(UNAUTHORIZED);
  }

  async function onDismissNotification(ctx) {
    const client = ctx.identity.username;
    const { owner } = ctx.arguments;
    if (client === owner) {
      return {
        id: '00000000-0000-0000-0000-000000000000',
        updatedAt: new Date().toISOString(),
        owner,
        mutationId: 'DUMMY_MUTATION_ID',
      };
    }
    throw new Error(UNAUTHORIZED);
  }

  async function onUpdateOwnedProject(ctx) {
    const client = ctx.identity.username;
    const { owner } = ctx.arguments;
    if (client === owner) {
      return {
        id: '00000000-0000-0000-0000-000000000000',
        permalink: 'dummy-project',
        rank: 0,
        title: 'Dummy Project',
        privacy: 'public',
        permissions: 'rw',
        statusSet: [],
        defaultStatus: '00000000-0000-0000-0000-000000000000',
        updatedAt: new Date().toISOString(),
        owner: client,
        mutationId: 'DUMMY_MUTATION_ID',
      };
    }
    throw new Error(UNAUTHORIZED);
  }

  async function onDeleteOwnedProject(ctx) {
    const client = ctx.identity.username;
    const { owner } = ctx.arguments;
    if (client === owner) {
      return {
        id: '00000000-0000-0000-0000-000000000000',
        updatedAt: new Date().toISOString(),
        owner: client,
        mutationId: 'DUMMY_MUTATION_ID',
      };
    }
    throw new Error(UNAUTHORIZED);
  }

  async function onUpdateProject(ctx) {
    const client = ctx.identity.username;
    const projectId = ctx.arguments.id;
    try {
      if (await isProjectSharedWithClient(projectId, client)) {
        return {
          id: '00000000-0000-0000-0000-000000000000',
          permalink: 'dummy-project',
          rank: 0,
          title: 'Dummy Project',
          privacy: 'public',
          permissions: 'rw',
          statusSet: [],
          defaultStatus: '00000000-0000-0000-0000-000000000000',
          updatedAt: new Date().toISOString(),
          owner: client,
          mutationId: 'DUMMY_MUTATION_ID',
        };
      }
      throw new Error(UNAUTHORIZED);
    } catch (err) {
      throw new Error(err);
    }
  }

  async function onDeleteProject(ctx) {
    const client = ctx.identity.username;
    const projectId = ctx.arguments.id;
    try {
      if (await isProjectSharedWithClient(projectId, client)) {
        return {
          id: projectId,
          updatedAt: new Date().toISOString(),
          owner: client,
          mutationId: 'DUMMY_MUTATION_ID',
        };
      }
      throw new Error(UNAUTHORIZED);
    } catch (err) {
      throw new Error(err);
    }
  }

  async function onCreateTaskByProjectId(ctx) {
    const client = ctx.identity.username;
    const { projectId } = ctx.arguments;
    if (await isProjectSharedWithClient(projectId, client)) {
      return {
        id: '00000000-0000-0000-0000-000000000000',
        projectId: '00000000-0000-0000-0000-000000000000',
        permalink: 1,
        rank: 0,
        task: 'Dummy Task',
        description: 'Dummy Description',
        due: '2020-01-01T00:00:00.000Z',
        tags: [],
        status: 'todo',
        priority: 'normal',
        assignees: [],
        anonymousAssignees: [],
        invitedAssignees: [],
        watchers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client,
        mutationId: 'DUMMY_MUTATION_ID',
      };
    }
    throw new Error(UNAUTHORIZED);
  }

  async function onUpdateTaskByProjectId(ctx) {
    const client = ctx.identity.username;
    const { projectId } = ctx.arguments;
    if (await isProjectSharedWithClient(projectId, client)) {
      return {
        id: '00000000-0000-0000-0000-000000000000',
        projectId,
        action: 'create',
        field: 'task',
        value: 'dummy',
        updatedAt: new Date().toISOString(),
        mutationId: 'DUMMY_MUTATION_ID',
      };
    }
    throw new Error(UNAUTHORIZED);
  }

  async function onDeleteTaskByProjectId(ctx) {
    const client = ctx.identity.username;
    const { projectId } = ctx.arguments;
    if (await isProjectSharedWithClient(projectId, client)) {
      return {
        id: '00000000-0000-0000-0000-000000000000',
        projectId,
        updatedAt: new Date().toISOString(),
        mutationId: 'DUMMY_MUTATION_ID',
      };
    }
    throw new Error(UNAUTHORIZED);
  }

  async function onCreateCommentByTaskId(ctx) {
    const client = ctx.identity.username;
    const { taskId } = ctx.arguments;
    if (await isTaskSharedWithClient(taskId, client)) {
      return {
        id: '00000000-0000-0000-0000-000000000000',
        taskId,
        content: '{}',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client,
        mutationId: 'DUMMY_MUTATION_ID',
      };
    }
    throw new Error(UNAUTHORIZED);
  }

  async function onDeleteCommentByTaskId(ctx) {
    const client = ctx.identity.username;
    const { taskId } = ctx.arguments;
    if (await isTaskSharedWithClient(taskId, client)) {
      return {
        id: '00000000-0000-0000-0000-000000000000',
        taskId,
        updatedAt: new Date().toISOString(),
        mutationId: 'DUMMY_MUTATION_ID',
      };
    }
    throw new Error(UNAUTHORIZED);
  }

  async function onPushUserUpdate(ctx) {
    const client = ctx.identity.username;
    const { username } = ctx.arguments;
    if (client === username) {
      return {
        username,
        firstName: 'Joe',
        lastName: 'Doe',
        updatedAt: new Date().toISOString(),
      };
    }
    throw new Error(UNAUTHORIZED);
  }

  async function onPushNotification(ctx) {
    const client = ctx.identity.username;
    const { owner } = ctx.arguments;
    if (client === owner) {
      return {
        id: '00000000-0000-0000-0000-000000000000',
        projectId: '00000000-0000-0000-0000-000000000000',
        taskId: '00000000-0000-0000-0000-000000000000',
        commentId: null,
        action: 'update',
        field: 'status',
        value: 'pending',
        hint: 'demo task',
        read: false,
        mutator: 'joedoe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client,
      };
    }
    throw new Error(UNAUTHORIZED);
  }

  async function _fetchRecipientsData(usernames) {
    if (usernames.length) {
      let query = 'SELECT `users`.`username`, '
      + "`users`.`first_name` AS 'firstName', "
      + "`users`.`last_name` AS 'lastName', "
      + '`users`.`email` '
      + 'FROM users WHERE username IN (';
      for (let i = 0; i < usernames.length; i++) {
        query += '?';
        if (i < usernames.length - 1) {
          query += ', ';
        }
      }
      query += ')';
      try {
        const data = await pool.execute(query, usernames);
        return data || [];
      } catch (err) {
        throw new Error(err);
      }
    }
    return [];
  }

  async function _pushData(graphqlQuery, opName, input) {
    const req = new AWS.HttpRequest(APIURL, REGION);
    const { hostname: endpoint, port, protocol } = new UrlParse(APIURL);
    const client = protocol === 'https:' ? https : http;
    req.method = 'POST';
    req.path = '/graphql';
    req.headers.host = endpoint;
    req.headers['Content-Type'] = 'application/json';
    req.body = JSON.stringify({
      query: graphqlQuery,
      operationName: opName,
      variables: {
        input,
      },
    });
    const httpOpts = { ...req, host: endpoint };
    if (port) httpOpts.port = port;
    const signer = new AWS.Signers.V4(req, 'appsync', true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    await new Promise((resolve) => {
      const httpRequest = client.request(httpOpts, (result) => {
        let data = '';
        result.on('data', (chunk) => {
          data += chunk;
        });
        result.on('end', () => {
          resolve(JSON.parse(data.toString()));
        });
      });
      httpRequest.write(req.body);
      httpRequest.end();
    });
  }

  async function pushNotification(template, recipients) {
    const graphqlQuery = /* GraphQL */ `
        mutation pushNotification($input: PushNotificationInput!) {
          pushNotification(input: $input) {
            id
            projectId
            taskId
            commentId
            action
            field
            value
            hint
            read
            mutator
            createdAt
            updatedAt
            owner
          }
        }
      `;
    try {
      await Promise.all(Object.keys(recipients).map((recipient) => _pushData(graphqlQuery, 'pushNotification', {
        ...template,
        id: recipients[recipient],
        owner: recipient,
      })));
    } catch (err) {
      throw new Error(err);
    }
  }

  async function pushUserUpdate(userUpdate) {
    const graphqlQuery = /* GraphQL */ `
        mutation pushUserUpdate($input: pushUserUpdateInput!) {
          pushUserUpdate(input: $input) {
            username
            firstName
            lastName
            updatedAt
          }
        }
      `;
    try {
      await _pushData(graphqlQuery, 'pushUserUpdate', userUpdate);
    } catch (err) {
      throw new Error(err);
    }
  }
};
