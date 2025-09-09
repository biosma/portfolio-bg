'use client';

import { LocaleToggle } from '@/components/toggle-locale';
import { ModeToggle } from '@/components/toggle-theme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, MenuIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
  { id: 1, title: 'TradeNetHub', url: 'work/tradenethub' },
  { id: 2, title: 'Mena Homes', url: 'work/mena-homes' },
  { id: 3, title: 'Mentis', url: 'work/mentis' },
  { id: 4, title: 'Recovery Delivered', url: 'work/recovery-delivered' },
];

const navbarItems = [
  { href: '/', children: 'HOME' },
  { href: '/about', children: 'ABOUT' },
  { href: '/work', children: 'WORK', hasDropdown: true },
  { href: '/contact', children: 'CONTACT' },
  { href: '/sandbox', children: 'SANDBOX' },
];

interface DropdownMenuProps {
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  locale: string;
  pos: { left: number; top: number } | null;
}

function WorkDropdownPortal({
  isVisible,
  onMouseEnter,
  onMouseLeave,
  locale,
  pos,
}: DropdownMenuProps) {
  if (typeof document === 'undefined' || !pos) return null;

  return createPortal(
    <div
      className={cn(
        'fixed w-64 rounded-xl transition-all duration-200 z-[1100]',
        isVisible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2',
        'bg-white/30 dark:bg-accent/30 backdrop-blur-lg ring-1 ring-black/10 dark:ring-white/10',
      )}
      style={{ left: pos.left, top: pos.top }}
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
              'text-neutral-800 dark:text-neutral-100',
              'hover:bg-black/5 dark:hover:bg-white/5 hover:backdrop-brightness-110 dark:hover:backdrop-brightness-125',
              'transition-[background,filter] rounded-lg mx-2',
            )}
          >
            {project.title}
          </Link>
        ))}
      </div>
    </div>,
    document.body,
  );
}

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showWorkDropdown, setShowWorkDropdown] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations('NavBar');
  const locale = useLocale();

  // ref del trigger (wrapper del item WORK)
  const workTriggerRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ left: number; top: number } | null>(null);

  const computeDropdownPos = () => {
    const el = workTriggerRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const width = 256; // w-64
    const left = r.left + r.width / 2 - width / 2 + window.scrollX;
    const top = r.bottom + 12 + window.scrollY; // separacion 12px
    return { left, top };
  };

  const handleMouseEnterWork = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setDropdownPos(computeDropdownPos());
    setShowWorkDropdown(true);
  };

  const handleMouseLeaveWork = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowWorkDropdown(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  // reposicionar en resize/scroll mientras esté visible
  useEffect(() => {
    if (!showWorkDropdown) return;
    const onRecalc = () => setDropdownPos(computeDropdownPos());
    window.addEventListener('resize', onRecalc);
    window.addEventListener('scroll', onRecalc, { passive: true });
    return () => {
      window.removeEventListener('resize', onRecalc);
      window.removeEventListener('scroll', onRecalc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showWorkDropdown]);

  return (
    <nav className="h-20 flex justify-center items-center font-medium relative z-[1000]">
      <NavbarSidebar open={isOpen} onOpenChange={setIsOpen} items={navbarItems} />

      <div
        className={cn(
          'hidden lg:flex flex-1 justify-center gap-6',
          !pathname.includes('/sandbox') && 'ps-[12.5%]',
        )}
      >
        <div className="hidden lg:flex justify-center gap-6 px-6 py-2 bg-white/30 dark:bg-accent/30 backdrop-blur-lg w-fit rounded-lg">
          {navbarItems.map((item) => {
            const isWorkItem = item.href === '/work';
            const isActive =
              item.href === `/` ? pathname === `/${locale}` : pathname.includes(item.href);

            return (
              <div
                key={item.href}
                className="relative"
                ref={isWorkItem ? workTriggerRef : undefined}
              >
                <NavbarItem
                  href={item.href}
                  isActive={isActive}
                  hasDropdown={item.hasDropdown}
                  onMouseEnter={isWorkItem && isActive ? handleMouseEnterWork : undefined}
                  onMouseLeave={isWorkItem && isActive ? handleMouseLeaveWork : undefined}
                >
                  {t(item.children)}
                </NavbarItem>

                {/* El portal se monta una única vez para WORK */}
                {isWorkItem && (
                  <WorkDropdownPortal
                    isVisible={showWorkDropdown}
                    onMouseEnter={handleMouseEnterWork}
                    onMouseLeave={handleMouseLeaveWork}
                    locale={locale}
                    pos={dropdownPos}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!pathname.includes('/sandbox') && (
        <div className="flex items-center gap-2 pe-6">
          <LocaleToggle />
          <ModeToggle />
        </div>
      )}

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
