const fs = require('fs');
const path = require('path');

const templateBase = fs.readFileSync(path.resolve(__dirname, 'base.html'), 'utf8');

const templateBaseRe = /(?:\{\{MESSAGE_TITLE\}\}|\{\{MESSAGE_BODY\}\})/gmi;

const getTemplate = (templateID) => {
  const templateRaw = fs.readFileSync(path.resolve(__dirname, `${templateID}.html`), 'utf8');
  const lines = templateRaw.split('\n');
  const subject = lines.shift();
  const title = lines.shift();
  const body = lines.join('\n                    ');
  return {
    subject,
    body: templateBase.replace(templateBaseRe, (x) => {
      switch (x) {
        case '{{MESSAGE_TITLE}}':
          return title;
        case '{{MESSAGE_BODY}}':
          return body;
        default:
          return x;
      }
    }),
  };
};

const templates = {
  assignment: getTemplate('assignment'),
  assignmentWatching: getTemplate('assignmentWatching'),
  anonymousAssignmentWatching: getTemplate('anonymousAssignmentWatching'),
  invitation: getTemplate('invitation'),
  invitationWatching: getTemplate('invitationWatching'),
  addingWatcher: getTemplate('addingWatcher'),
  addingWatcherWatching: getTemplate('addingWatcherWatching'),
  dueUpdate: getTemplate('dueUpdate'),
  priorityUpdate: getTemplate('priorityUpdate'),
  statusUpdate: getTemplate('statusUpdate'),
  commentation: getTemplate('commentation'),
};

const getContent = (templateID, entities = {}) => {
  const result = { ...templates[templateID] };
  const entitiesKeyValuePairs = Object.entries(entities);
  const entitiesKeys = Object.keys(entities).join('\\}\\}|\\{\\{');
  if (entitiesKeyValuePairs.length) {
    const replacer = (x) => entities[x.replace(/\{\{|\}\}/g, '')];
    const regex = new RegExp(`(?:\\{\\{${entitiesKeys}\\}\\})`, 'gmi');
    result.subject = result.subject.replace(regex, replacer);
    result.body = result.body.replace(regex, replacer);
  }
  return result;
};

module.exports = { getContent };
