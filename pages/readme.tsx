import React from "react";
import "tailwindcss/tailwind.css";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});

const Announcement: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl text-center">{t("announcement.title")}</h1>
      <p className="text-center mt-4">{t("announcement.content")}</p>
      <p className="text-center mt-4">{t("announcement.apology")}</p>
      <p className="text-center mt-4">
        {t("announcement.opensource")}{" "}
        <a
          className="text-blue-500 hover:text-blue-700"
          href="https://github.com/okidoki2me"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://github.com/okidoki2me
        </a>
      </p>
    </div>
  );
};

export default Announcement;
