export const createNote = `mutation createNote($note: String!, $isDone: Boolean!) {
	createNote(input: { note: $note, isDone: $isDone }) {
		__typename
		id
		note
		isDone
		task
		description
		steps
		due
		assigned
		watcher
		project
		tag
		sprint
		status
		comment
	}
}`

export const updateNote = `mutation updateNote(
	$id: ID!
	$note: String!
	$isDone: Boolean!
	$task: String
	$description: String
	$steps: String
	$due: String
	$assigned: String
	$watcher: String
	$project: String
	$tag: String
	$sprint: String
	$status: String
	$comment: String
) {
	updateNote(
		input: {
			id: $id
			note: $note
			isDone: $isDone
			task: $task
			description: $description
			steps: $steps
			due: $due
			assigned: $assigned
			watcher: $watcher
			project: $project
			tag: $tag
			sprint: $sprint
			status: $status
			comment: $comment
		}
	) {
		__typename
		id
		note
		isDone
		task
		description
		steps
		due
		assigned
		watcher
		project
		tag
		sprint
		status
		comment
	}
}`

export const deleteNote = `mutation deleteNote($id: ID!) {
	deleteNote(input: { id: $id }) {
		__typename
		id
		note
		isDone
		task
		description
		steps
		due
		assigned
		watcher
		project
		tag
		sprint
		status
		comment
	}
}`

export const listNotes = `query listNotes {
	listNotes {
		items {
			__typename
			id
			note
			isDone
			task
			description
			steps
			due
			assigned
			watcher
			project
			tag
			sprint
			status
			comment
		}
	}
}`