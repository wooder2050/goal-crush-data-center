'use client';

import * as React from 'react';

import { THEME } from '@/constants/theme';
import { cn } from '@/lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          'h-15 bg-white border-b border-gray-200 px-4 lg:px-6',
          className
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-black">
                {THEME.brand.name}
              </h1>
              <span className="text-sm text-gray-600 hidden sm:block">
                {THEME.brand.tagline}
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {children}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Add your action buttons here */}
          </div>
        </div>
      </header>
    );
  }
);
Header.displayName = 'Header';

interface NavItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  isActive?: boolean;
}

const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ className, href, isActive, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'text-sm font-medium transition-colors hover:text-black',
          isActive ? 'text-black' : 'text-gray-600',
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);
NavItem.displayName = 'NavItem';

export { Header, NavItem };
