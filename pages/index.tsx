import Image from "next/image";
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import axios from "axios";
import { message } from "antd";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});

export const checkToken = async () => {
  if (window.location.hostname === "venioless.vercel.app") {
    window.location.href = "https://venioless.tzpro.uk";
  }
  if (
    window.location.hostname === "localhost" &&
    process.env.NODE_ENV === "production"
  ) {
    window.location.href = "https://venioless.tzpro.uk";
  }
  const JWT = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token") || "")
    : null;

  if (JWT) {
    axios.defaults.headers.common["Authorization"] = `${JWT.value}`;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/jwt`,
      );

      if (response.status === 200) {
        message.success("Welcome back!");
        // 3s
        setTimeout(() => {
          window.location.href = "/video";
        }, 3000);
      }
    } catch (error) {
      // 清空 token
      localStorage.removeItem("token");
    }

    // 清空 token
    localStorage.removeItem("token");
  }
};

const Home: React.FC = () => {
  const { t } = useTranslation("common");
  const [showNewLayout, setShowNewLayout] = useState<boolean>(false);
  const [invitationCode, setInvitationCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    checkToken().then(() => {});
  }, []);

  const handleSignInClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setShowNewLayout(true);
  };

  const verifyInvitationCode = async (code: string) => {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backend) {
      throw new Error("BACKEND_URL is not defined");
    }

    const url = `${backend}/invitations/verify`;

    try {
      const response = await axios.post(url, { code });

      if (response.status === 200) {
        const jwtToken = response.data.token;

        if (jwtToken) {
          const expiresIn = 3600 * 1000; // 1 hour in milliseconds
          const tokenObject = {
            value: jwtToken,
            expiresAt: Date.now() + expiresIn,
          };

          localStorage.setItem("token", JSON.stringify(tokenObject));
          setErrorMessage("");
          window.location.href = "/input";
        } else {
          setErrorMessage(t("JWTSetError"));
          window.location.reload();
        }
      } else {
        setErrorMessage(t("invalidInvitationCode"));
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 429) {
          setErrorMessage(t("rateLimitError"));
        } else {
          setErrorMessage(
            error.response.data.error || t("verificationCodeError"),
          );
        }
      } else {
        setErrorMessage(t("verificationCodeError"));
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
      {!showNewLayout && (
        <>
          <div className="transition duration-500 ease-in-out transform">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" onClick={handleSignInClick}>
              <Image
                alt="user profile photo"
                className="w-64 h-64 rounded"
                height={256}
                src="/kcl-logo.svg"
                width={256}
              />
            </a>
          </div>

          <div className="w-full sm:max-w-md mt-6 px-6 py-2 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg transition duration-500 ease-in-out transform">
            <div className="mt-4 mb-4 px-4 py-2 rounded dark:text-slate-100 flex flex-row justify-center">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                className="flex align-center me-4"
                href="/"
                onClick={handleSignInClick}
              >
                <span className="me-4">
                  <svg
                    height="40"
                    viewBox="0 0 448 512"
                    width="36"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"
                      fill="#e60505"
                    />
                  </svg>
                </span>
                <span className="block text-bold text-base align-center ms-4 py-2">
                  Sign in with your King&apos;s ID
                </span>
              </a>
            </div>
          </div>
        </>
      )}

      {showNewLayout && (
        <div className="min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
          <Image
            alt="Meme Image"
            className="w-64 h-64 rounded"
            height={256}
            src="/unHappy.jpg"
            width={256}
          />
          <div className="text-center mt-4">
            <h2 className="text-red-500">{t("unofficial")}</h2>
            <p className="mt-2">{t("agreement")}</p>
            <input
              className="mt-4 p-2 border rounded bg-white"
              placeholder="Enter invitation code"
              type="text"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
            />
            <button
              className="mt-2 p-2 bg-blue-500 text-white rounded"
              onClick={() => verifyInvitationCode(invitationCode)}
            >
              Verify
            </button>
            {errorMessage && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
