import "./App.css";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";

export default function App() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const [token, setToken] = useState("");

  async function getBoardConnection() {}

  async function checkForToken() {
    const hashParams = new URLSearchParams(location.hash.slice(1)); // strip leading '#'
    const token = hashParams.get("token");

    if (token) setToken(token);
  }

  useEffect(() => {
    if (roomId) {
      getBoardConnection();
      checkForToken();
    }
  }, []);

  return (
    <div>
      <h1>Trelo Link</h1>
      {token ? <></> : <></>}
    </div>
  );
}
