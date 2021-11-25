import { customAlphabet } from 'nanoid'
import store from "../store"
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 36);
export default () => {
  const username = store.getState().user.data?.username;
  return username ? username + "-" + nanoid() : nanoid();
}