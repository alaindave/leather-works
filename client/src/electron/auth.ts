import keytar from "keytar";

const SERVICE = "Afritan";
const ACCOUNT = "auth-token";

//save token
export async function saveToken(token: string) {
  await keytar.setPassword(SERVICE, ACCOUNT, token);
}

//get token
export async function getToken() {
  return await keytar.getPassword(SERVICE, ACCOUNT);
}

//clear session
export async function clearToken() {
  await keytar.deletePassword(SERVICE, ACCOUNT);
}
