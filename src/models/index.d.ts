import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Note {
  readonly id: string;
  readonly note: string;
  readonly isDone: boolean;
  readonly task?: string;
  readonly description?: string;
  readonly steps?: string;
  readonly due?: string;
  readonly assigned?: string;
  readonly watcher?: string;
  readonly project?: string;
  readonly tag?: (string | null)[];
  readonly sprint?: string;
  readonly status?: string;
  readonly comments?: (Comment | null)[];
  constructor(init: ModelInit<Note>);
  static copyOf(source: Note, mutator: (draft: MutableModel<Note>) => MutableModel<Note> | void): Note;
}

export declare class Comment {
  readonly id: string;
  readonly noteID: string;
  readonly commenter?: string;
  readonly content: string;
  constructor(init: ModelInit<Comment>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment>) => MutableModel<Comment> | void): Comment;
}