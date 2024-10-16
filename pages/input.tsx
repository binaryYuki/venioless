import React, { useState } from "react";
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

  const validateHtml = (html: string): boolean => {
    return (
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/.test(html) &&
      /<!DOCTYPE html>/.test(html) &&
      /<title>Venio - Attendance Management<\/title>/.test(html)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateHtml(html1) || !validateHtml(html2)) {
      setError(t("invalidHtml"));

      return;
    }

    // You can add further processing here
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white text-gray-800 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t("htmlInputPageTitle")}
      </h1>
      <p className="text-lg text-center mb-6">{t("htmlInputPageDesc")}</p>
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
          提交
        </Button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
      <Footer />
    </div>
  );
}
