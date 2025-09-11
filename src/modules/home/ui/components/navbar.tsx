'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleToggle } from '@/components/toggle-locale';
import { ModeToggle } from '@/components/toggle-theme';
import { Button } from '@/components/ui/button';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { navbarItems, projects } from '../../constants';

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
      className={cn(
        'border-none bg-transparent px-3.5 text-xl shadow-none dark:bg-transparent',
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={href}
        className={cn(
          'relative flex items-center gap-1 transition-colors',
          isActive &&
            'after:absolute after:-bottom-1 after:left-1/3 after:h-[2px] after:w-1/3 after:rounded-full after:bg-black after:transition-all after:duration-300 after:content-[""] dark:after:bg-white',
        )}
      >
        {children}
        {hasDropdown && (
          <ChevronDownIcon
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isActive && 'rotate-180',
            )}
          />
        )}
      </Link>
    </Button>
  );
};

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
  pos,
}: DropdownMenuProps) {
  if (typeof document === 'undefined' || !pos) return null;

  return createPortal(
    <div
      className={cn(
        'fixed z-[1100] w-64 rounded-xl transition-all duration-200',
        isVisible
          ? 'visible translate-y-0 opacity-100'
          : 'invisible -translate-y-2 opacity-0',
        'dark:bg-accent/30 bg-white/30 ring-1 ring-black/10 backdrop-blur-lg dark:ring-white/10',
      )}
      style={{ left: pos.left, top: pos.top }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="py-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`${project.url}`}
            className={cn(
              'block px-4 py-3 text-sm font-medium',
              'text-neutral-800 dark:text-neutral-100',
              'hover:bg-black/5 hover:backdrop-brightness-110 dark:hover:bg-white/5 dark:hover:backdrop-brightness-125',
              'mx-2 rounded-lg transition-[background,filter]',
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
  const [showWorkDropdown, setShowWorkDropdown] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations('NavBar');
  const locale = useLocale();

  // ref del trigger (wrapper del item WORK)
  const workTriggerRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    left: number;
    top: number;
  } | null>(null);

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
    <nav className="relative z-[1000] hidden h-20 w-full items-start justify-start font-medium md:flex md:items-center md:justify-center">
      <div
        className={cn(
          'hidden flex-1 justify-center gap-6 md:flex',
          !pathname.includes('/sandbox') && 'ps-[12.5%]',
        )}
      >
        <div className="dark:bg-accent/30 hidden w-fit justify-center gap-6 rounded-lg bg-white/30 px-6 py-2 backdrop-blur-lg lg:flex">
          {navbarItems.map((item) => {
            const isWorkItem = item.href === '/work';
            const isActive =
              item.href === `/`
                ? pathname === `/${locale}`
                : pathname.includes(item.href);

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
                  onMouseEnter={
                    isWorkItem && isActive ? handleMouseEnterWork : undefined
                  }
                  onMouseLeave={
                    isWorkItem && isActive ? handleMouseLeaveWork : undefined
                  }
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
        <div className="hidden items-center gap-2 pe-6 md:flex">
          <LocaleToggle />
          <ModeToggle />
        </div>
      )}
    </nav>
  );
};
