import { Link } from "@nextui-org/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center py-3">
      <Link
        isExternal
        className="flex items-center gap-1 text-current"
        href="https://zh.wikipedia.org/wiki/%E9%9D%9E%E6%B3%95%E8%8E%B7%E5%8F%96%E8%AE%A1%E7%AE%97%E6%9C%BA%E4%BF%A1%E6%81%AF%E7%B3%BB%E7%BB%9F%E6%95%B0%E6%8D%AE%E3%80%81%E9%9D%9E%E6%B3%95%E6%8E%A7%E5%88%B6%E8%AE%A1%E7%AE%97%E6%9C%BA%E4%BF%A1%E6%81%AF%E7%B3%BB%E7%BB%9F%E7%BD%AA"
        title="一天一个入狱小技巧"
      >
        <span className="text-primary-50">Powered by</span>
        <p className="text-primary">XBOT 4000</p>
      </Link>
    </footer>
  );
}
