import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";

import "@/styles/globals.css";
import "@/config/i18n"; // 导入i18n配置

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider>
        <Component {...pageProps} />
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default appWithTranslation(App);

export const fonts = {
  sans: "font-sans", // 根据你的配置更改
  mono: "font-mono", // 根据你的配置更改
};
