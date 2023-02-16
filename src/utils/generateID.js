import { customAlphabet } from 'nanoid'
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 36);
const generateId = (existingIds = []) => {
  let result = nanoid();
  while(existingIds.includes(result)) {
    result = nanoid();
  }
  return result;
}

export default generateId;
