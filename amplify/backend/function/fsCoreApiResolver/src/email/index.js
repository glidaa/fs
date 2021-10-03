const fs = require('fs')
const path = require('path')

const getTemplate = (templateID) => {
    const templateRaw = fs.readFileSync(path.resolve(__dirname, `${templateID}.html`), 'utf8')
    return {
        subject: templateRaw.substring(0, templateRaw.indexOf('\n')),
        body: templateRaw.substring(templateRaw.indexOf('\n') + 1)
    }
}

const templates = {
    assignment: getTemplate("assignment"),
    assignmentWatching: getTemplate("assignmentWatching")
}

const getContent = (templateID, entities) => {
    const result = templates[templateID]
    const entitiesKeyValuePairs = Object.entries(entities)
    for (const entitiesKeyValuePair of entitiesKeyValuePairs) {
        const replacementRegex = new RegExp(`\\[${entitiesKeyValuePair[0]}\\]`, "g")
        result.subject = result.subject.replace(replacementRegex, entitiesKeyValuePair[1])
        result.body = result.body.replace(replacementRegex, entitiesKeyValuePair[1])
    }
    return result
}

module.exports = { getContent }