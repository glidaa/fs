// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Note, Comment } = initSchema(schema);

export {
  Note,
  Comment
};