import axios from "axios";

export default async function fetchFirebaseConfig() {
  const data = await axios.get("/api/firebaseConfig");

  return data.data;
}
