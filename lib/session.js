import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "sm_sess";

function sign(payload, secret){
  const mac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${mac}`;
}
function verify(signed, secret){
  if (!signed || !signed.includes(".")) return null;
  const [payload, mac] = signed.split(".");
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  try{
    if (crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return payload;
  }catch{}
  return null;
}

export function setSession(userId){
  const secret = process.env.SESSION_SECRET || "change-me";
  cookies().set(COOKIE, sign(userId, secret), {
    httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60*60*24*30,
  });
}

export function clearSession(){
  cookies().set(COOKIE, "", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 0 });
}

export function getSessionUserId(){
  const secret = process.env.SESSION_SECRET || "change-me";
  const v = cookies().get(COOKIE)?.value;
  return verify(v, secret);
}
