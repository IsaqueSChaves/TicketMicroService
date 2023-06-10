import buildClient from "./api/buildClient";
import "bootstrap/dist/css/bootstrap.css";
import Header from "@/components/header";
import "@/styles/globals.css";

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </>
  );
}
