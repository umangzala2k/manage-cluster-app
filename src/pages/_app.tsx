import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import HttpServices from '@/service/httpServices'
import Router from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);

  const httpService = new HttpServices()

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setLoading(false);
    };

    const handleRouteChangeError = () => {
      setLoading(false);
    };

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);
    Router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
      Router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [])

  useEffect(() => {
    fetchInitialData();
  })

  const fetchInitialData = async () => {
    try {
      const { data } = await httpService.getClusters()
      const { id, name } = data[0]
      const parsedData = JSON.stringify({ id, name })
      localStorage.setItem('cluster', parsedData)
    } catch (error) {
      console.error('error at [fetchInitialData]', { error });
    }
  };


  return (
    <>
      {loading && <div> Loading... </div>}
      {!loading && <Layout>
        <Component {...pageProps} />
      </Layout>}
    </>
  );
}
