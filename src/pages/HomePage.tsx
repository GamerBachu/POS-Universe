import { userApi } from "@/api";
import { useEffect } from "react";

function HomePage() {

  useEffect(() => {
    userApi.post({
      username: "Abc",
      password: "ppp"
    });
  }, []);

  return <h1>Home</h1>;
}

export default HomePage;
