import React, { useState } from "react";
import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Footer from "@/components/footer";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});

export default function InputHtmlPage() {
  const [html1, setHtml1] = useState<string>("");
  const [html2, setHtml2] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { t } = useTranslation("common");

  const parseAndValidateHtml = (html: string, htmlTag: number): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Check title
    const title = doc.querySelector("title");

    if (!title || title.textContent !== " Venio - Attendance Management ") {
      return t("missingOrIncorrectTitle");
    }

    // Check current-activity tag
    const currentActivity = doc.querySelector("current-activity");

    // html2 不参加这个检查
    if (!currentActivity && htmlTag === 1) {
      return t("missingCurrentActivityTag");
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const error1 = parseAndValidateHtml(html1, 1);
    const error2 = parseAndValidateHtml(html2, 2);

    if (error1) {
      setError(t("firstParagraphInvalid") + ": " + error1);

      return;
    }

    if (error2) {
      setError(t("secondParagraphInvalid") + ": " + error2);

      return;
    }

    try {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!backend) {
        setError(t("backendUrlNotDefined"));
      }

      const url = `${backend}/getAttendanceInfo`;
      const JWT = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token") || "")
        : null;

      if (!JWT) {
        setError(t("unauthorized"));
        window.location.href = "/";
      } else {
        axios.defaults.headers.common["Authorization"] = `${JWT.value}`;
      }
      const response = await axios.post(url, {
        previous: html2,
        current: html1,
      });

      if (response.status === 200) {
        // 储存到 localStorage key 为 attend_info
        localStorage.setItem("attend_info", JSON.stringify(response.data));
        window.location.href = "/record";
      } else if (response.status === 204) {
        setError(t("unauthorized"));
        // clear token
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      } else {
        const errorCode: number = response.data.error;

        if (errorCode === 102) {
          setError(t("htmlInputError102"));
        } else {
          setError(t("verificationError"));
        }
      }
    } catch (error) {
      setError(t("verificationError"));
    }
  };

  const pageDescription = (
    <>
      {t("htmlInputPageDesc.start") + " "}
      <a
        href="https://support.google.com/webmasters/answer/11626894?hl=en-GB"
        rel="noopener noreferrer"
        style={{ textDecoration: "underline", color: "blue" }}
        target="_blank"
      >
        {t("htmlInputPageDesc.middle")}
      </a>
      {" " + t("htmlInputPageDesc.end")}
    </>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white text-gray-800 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t("htmlInputPageTitle")}
      </h1>
      <p className="text-lg text-center mb-6">{pageDescription}</p>
      <form className="space-y-6 w-full" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label className="text-lg font-medium" htmlFor="html1">
            {t("firstParagraphHTML")}
          </Label>
          <Textarea
            className="min-h-[200px] font-mono w-full"
            id="html1"
            placeholder={t("firstParagraphHTMLPlaceholder")}
            value={html1}
            onChange={(e) => setHtml1(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-lg font-medium" htmlFor="html2">
            {t("secondParagraphHTML")}
          </Label>
          <Textarea
            className="min-h-[200px] font-mono w-full"
            id="html2"
            placeholder={t("secondParagraphHTMLPlaceholder")}
            value={html2}
            onChange={(e) => setHtml2(e.target.value)}
          />
        </div>
        <Button
          className="w-full bg-blue-500 text-white hover:bg-blue-600"
          type="submit"
        >
          {t("submitButton")}
        </Button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
      <Footer />
    </div>
  );
}
