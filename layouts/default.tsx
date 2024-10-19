import { Layout } from "antd";
import { Link } from "@nextui-org/link";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";
import "antd/dist/reset.css"; // 引入 Ant Design 样式

const { Header, Content, Footer } = Layout;

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout className="min-h-screen">
      <Head />
      <Header className="bg-white shadow-md">
        <Navbar />
      </Header>
      <Content className="container mx-auto max-w-7xl px-6 pt-16">
        {children}
      </Content>
      <Footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
          title="nextui.org homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">Mr. Nobody</p>
        </Link>
      </Footer>
    </Layout>
  );
}
