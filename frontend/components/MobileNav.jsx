import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AlignJustify } from 'lucide-react';

import Nav from './Nav';
import Logo from './Logo'
import Socials from './Socials';

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <AlignJustify className='cursor-pointer' />
      </SheetTrigger>
      <SheetContent>
        <div className='bg-white'> {/* 배경색을 흰색으로 변경 */}
          <div className='flex flex-col items-center gap-y-32 bg-transparent'>
            <Logo />
            <Nav 
              containerStyles='flex flex-col items-center gap-y-6 bg-transparent' 
              linkStyles='text-2xl' />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav;
