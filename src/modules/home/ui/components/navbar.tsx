'use client';

import { LocaleToggle } from '@/components/toggle-locale';
import { ModeToggle } from '@/components/toggle-theme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, MenuIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { NavbarSidebar } from './navbar-sidebar';

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  hasDropdown?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const NavbarItem = ({
  href,
  children,
  isActive,
  hasDropdown,
  onMouseEnter,
  onMouseLeave,
}: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant="outline"
      className={cn('bg-transparent border-none px-3.5 text-xl shadow-none dark:bg-transparent')}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={href}
        className={cn(
          'relative transition-colors flex items-center gap-1',
          isActive &&
            'after:content-[""] after:absolute after:-bottom-1 after:left-1/3 after:w-1/3 after:h-[2px] after:rounded-full after:bg-black dark:after:bg-white after:transition-all after:duration-300',
        )}
      >
        {children}
        {hasDropdown && (
          <ChevronDownIcon
            className={cn('w-4 h-4 transition-transform duration-200', isActive && 'rotate-180')}
          />
        )}
      </Link>
    </Button>
  );
};

const projects = [
  {
    id: 1,
    title: 'TradeNetHub',
    url: 'work/tradenethub',
  },
  {
    id: 2,
    title: 'Mena Homes',
    url: 'work/mena-homes',
  },
  {
    id: 3,
    title: 'Mentis',
    url: 'work/mentis',
  },
  {
    id: 4,
    title: 'Recovery Delivered',
    url: 'work/recovery-delivered',
  },
];

const navbarItems = [
  {
    href: '/',
    children: 'HOME',
  },
  {
    href: '/about',
    children: 'ABOUT',
  },
  {
    href: '/work',
    children: 'WORK',
    hasDropdown: true,
  },
  {
    href: '/contact',
    children: 'CONTACT',
  },
  {
    href: '/sandbox',
    children: 'SANDBOX',
  },
];

interface DropdownMenuProps {
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  locale: string;
}

const WorkDropdown = ({ isVisible, onMouseEnter, onMouseLeave, locale }: DropdownMenuProps) => {
  return (
  <div
  className={cn(
    'absolute top-full left-1/2 -translate-x-1/6 mt-4 w-64 rounded-xl transition-all duration-200 z-50',
    isVisible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2',
    "bg-white/30 dark:bg-accent/30 backdrop-blur-lg z-[1100]"
  )}
  onMouseEnter={onMouseEnter}
  onMouseLeave={onMouseLeave}
>
  <div className="py-2">
    {projects.map((project) => (
      <Link
        key={project.id}
        href={`/${locale}/${project.url}`}
        className={cn(
          'block px-4 py-3 text-sm font-medium',
          // Colores de texto con buen contraste,
          'text-neutral-800 dark:text-neutral-100',
          // Hover con fondo translúcido (no opaco) + leve incremento de brillo
          'hover:bg-black/5 dark:hover:bg-white/5 hover:backdrop-brightness-110 dark:hover:backdrop-brightness-125',
          'transition-[background,filter] rounded-lg mx-2'
        )}
      >
        {project.title}
      </Link>
    ))}
  </div>
</div>

  );
};

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showWorkDropdown, setShowWorkDropdown] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations('NavBar');
  const locale = useLocale();

  const handleMouseEnterWork = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setShowWorkDropdown(true);
  };

  const handleMouseLeaveWork = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowWorkDropdown(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="h-20 flex justify-center items-center font-medium relative  z-[1000]">
      <NavbarSidebar open={isOpen} onOpenChange={setIsOpen} items={navbarItems} />

      <div className={cn("hidden lg:flex flex-1 justify-center gap-6", !pathname.includes('/sandbox') && "ps-[12.5%]")}>
        <div className='hidden lg:flex justify-center gap-6 px-6 py-2 bg-white/30 dark:bg-accent/30 backdrop-blur-lg w-fit rounded-lg'>{navbarItems.map((item) => {
          const isWorkItem = item.href === '/work';
          const isActive =
            item.href === `/` ? pathname === `/${locale}` : pathname.includes(item.href);

          return (
            <div key={item.href} className="relative">
              <NavbarItem
                href={item.href}
                isActive={isActive}
                hasDropdown={item.hasDropdown}
                onMouseEnter={isWorkItem && isActive? handleMouseEnterWork : undefined}
                onMouseLeave={isWorkItem && isActive? handleMouseLeaveWork : undefined}
              >
                {t(item.children)}
              </NavbarItem>

              {isWorkItem && (
                <WorkDropdown
                  isVisible={showWorkDropdown}
                  onMouseEnter={handleMouseEnterWork}
                  onMouseLeave={handleMouseLeaveWork}
                  locale={locale}
                />
              )}
            </div>
          );
        })}
      </div>
      </div>

      {!pathname.includes('/sandbox') && <div className="flex items-center gap-2 pe-6">
        <LocaleToggle />
        <ModeToggle />
      </div>}

      <div className="items-center justify-center gap-4 flex lg:hidden">
        <Button
          variant="ghost"
          className="size-12 border-transparent bg-white "
          onClick={() => setIsOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};
