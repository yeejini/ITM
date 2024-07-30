'use client';
import React, { useState, useEffect} from "react";

import Logo from './Logo';
import ThemeToggler from "./ThemeToggler"
import Nav from './Nav';
import MobileNav from "./MobileNav";
import { useRouter, RedirectType, usePathname } from "next/navigation";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

const Header =() => {
  const [header, setHeader] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const scrollYPos = window.addEventListener('scroll', () => {
      window.scrollY > 50 ? setHeader(true): setHeader(false);
    });

    return () => window.removeEventListener('scroll', scrollYPos);
  });

    // interview 페이지에서는 Navbar를 숨김
    if (router.pathname === '/interview') {
      return null;
    }
  return (
    // 스크롤 내릴 때, navbar그림자
    <header
      className={`${
        header
          ? 'py-6 bg-white shadow-lg dark:bg-accent'
          : 'py-6 dark:bg-transparent'
      } sticky top-0 z-30 transition-all ${pathname === '/'}`}
    >
      <div className='container mx-auto'>
        <div className='flex justify-between items-center'>
          <Logo />
          <div className="flex items-center gap-x-6">
            <Nav 
              containerStyles='hidden xl:flex gap-x-8 
            items-center bg-transparent' 
            linkStyles='relative hover:text-primary
            transition=all'
            underlineStyles='absolute left-0 top-full h-{2px}
            bg-primary w-full'
            />
            <ThemeToggler />
            <div className="xl:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header