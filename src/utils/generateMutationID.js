import { v4 as uuidv4 } from 'uuid';

export default (username) => username + Date.now() + uuidv4()