import { useEffect } from "react";
import Router from "next/router";
import axios from "axios";

export default function SignOut() {
  useEffect(() => {
    const logOut = async () => {
      await axios.post("/api/users/signout").catch((err) => {
        console.log(err.message);
      });
      Router.push("/");
    };
    logOut();
  }, []);

  return <div>Signing you out...</div>;
}
