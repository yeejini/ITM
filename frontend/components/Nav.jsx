import Link from "next/link";

import { usePathname } from "next/navigation";

import {motion} from 'framer-motion';
const links = [
  {path: '/', name: 'home'},
  //{path: '/login', name: 'login'},
  {path: '/custom', name: 'custom'},
  {path: '/mypage', name: 'mypage'},
  {path: '/with', name: 'with'},
  {path: '/login', name: '로그인'}
  //{path: '/likework', name: 'likework'},

];

const Nav = ({ containerStyles, linkStyles, underlineStyles}) => {
  const path = usePathname();
  return (
    <nav className={`${containerStyles}`}>
      {links.map((link, index)=> {
        return (
          <Link 
            href={link.path}
            key={index}
            className={`capitalize ${linkStyles}`}
            >
              {link.path === path && (
                <motion.span 
                  initial={{y: '-100'}} 
                  animate={{y:0}} 
                  tranition={{type: 'tween'}} 
                  layoutId='underline' 
                  className={`${underlineStyles}`}
                />

              )}
              {link.name}
              
          </Link>
        );
      })}
    </nav>
  
  );
};
export default Nav;