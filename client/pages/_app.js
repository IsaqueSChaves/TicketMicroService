import "bootstrap/dist/css/bootstrap.css";
import "@/styles/globals.css";
import buildClient from "./api/build-client";
import Header from "@/components/header";

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { pageProps, ...data };
};
export default function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </>
  );
}
