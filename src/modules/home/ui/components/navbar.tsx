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
        'absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 z-50',
        isVisible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2',
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="py-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/${locale}/${project.url}`}
            className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
    <nav className="h-20 flex justify-center items-center font-medium relative">
      <NavbarSidebar open={isOpen} onOpenChange={setIsOpen} items={navbarItems} />

      <div className="hidden lg:flex flex-1 justify-center gap-6 ps-16">
        {navbarItems.map((item) => {
          const isWorkItem = item.href === '/work';
          const isActive =
            item.href === `/` ? pathname === `/${locale}` : pathname.includes(item.href);

          return (
            <div key={item.href} className="relative">
              <NavbarItem
                href={item.href}
                isActive={isActive}
                hasDropdown={item.hasDropdown}
                onMouseEnter={isWorkItem ? handleMouseEnterWork : undefined}
                onMouseLeave={isWorkItem ? handleMouseLeaveWork : undefined}
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

      <div className="flex items-center gap-2 pe-6">
        <LocaleToggle />
        <ModeToggle />
      </div>

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
