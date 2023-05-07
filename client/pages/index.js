import buildClient from "./api/build-client";

const Home = ({ response }) => {
  console.log("Response from index", response);
  return response ? <h1>{response.email}</h1> : <h1>You aren't signed in</h1>;
};

Home.getInitialProps = async (context) => {
  const client = buildClient(context);
  const response = await client.get("/api/users/currentuser");

  return { response: response ? response.data.currentUser : null };
};

export default Home;
