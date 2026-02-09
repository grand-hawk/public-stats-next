import {
  Box,
  Flex,
  IconButton,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import {
  LuBug,
  LuMenu,
  LuPanelLeftClose,
  LuPanelLeftOpen,
} from 'react-icons/lu';
import { MdRefresh } from 'react-icons/md';

import MTC from '@/components/icons/mtc';
import {
  primaryTabKeys,
  secondaryTabKeys,
  tabs,
  toolsTabKeys,
} from '@/components/layout/navigation/tabs';
import SidebarButton from '@/components/layout/sidebar/sidebarButton';
import SidebarGroup from '@/components/layout/sidebar/sidebarGroup';
import SidebarItem from '@/components/layout/sidebar/sidebarItem';
import SidebarLicense from '@/components/layout/sidebar/sidebarLicense';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useCurrentTab } from '@/hooks/useCurrentTab';
import { useDebugEnabled } from '@/hooks/useDebugEnv';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { useDevelopmentStore } from '@/stores/development';
import { useSidebarStore } from '@/stores/sidebar';
import { trpc } from '@/utils/trpc';

export default function Sidebar() {
  const debugEnabled = useDebugEnabled();
  const initials = usePlaceInitials();
  const currentTab = useCurrentTab();
  const utils = trpc.useUtils();
  const { isOverlayOpen, toggleOverlay } = useDevelopmentStore();
  const { isCollapsed, toggleCollapsed } = useSidebarStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isDesktop = useBreakpointValue({ base: false, md: true });

  React.useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  const navContent = (
    <Flex direction="column" gap={1} flex={1}>
      <SidebarGroup collapsed={isCollapsed}>
        {primaryTabKeys.map((key) => {
          const tab = tabs[key];
          return (
            <SidebarItem
              key={key}
              label={tab.label}
              href={`/${initials}${tab.path}`}
              icon={tab.icon}
              color={tab.color}
              active={currentTab?.path === tab.path}
              collapsed={isCollapsed}
              onClick={() => setMobileOpen(false)}
            />
          );
        })}
      </SidebarGroup>

      <SidebarGroup label="Analytics" collapsed={isCollapsed}>
        {secondaryTabKeys.map((key) => {
          const tab = tabs[key];
          return (
            <SidebarItem
              key={key}
              label={tab.label}
              href={`/${initials}${tab.path}`}
              icon={tab.icon}
              color={tab.color}
              active={currentTab?.path === tab.path}
              collapsed={isCollapsed}
              onClick={() => setMobileOpen(false)}
            />
          );
        })}
      </SidebarGroup>

      <SidebarGroup label="Tools" collapsed={isCollapsed}>
        {toolsTabKeys.map((key) => {
          const tab = tabs[key];
          return (
            <SidebarItem
              key={key}
              label={tab.label}
              href={`/${initials}${tab.path}`}
              icon={tab.icon}
              color={tab.color}
              active={currentTab?.path === tab.path}
              collapsed={isCollapsed}
              onClick={() => setMobileOpen(false)}
            />
          );
        })}
      </SidebarGroup>
    </Flex>
  );

  const mobileNav = (
    <Flex
      display={{ base: 'flex', md: 'none' }}
      alignItems="center"
      justifyContent="space-between"
      borderTopWidth="1px"
      padding={2}
      gap={2}
      gridRow="2"
    >
      <DrawerRoot
        open={mobileOpen}
        placement="start"
        onOpenChange={(e) => setMobileOpen(e.open)}
      >
        <DrawerTrigger asChild>
          <IconButton aria-label="Open menu" variant="ghost" size="lg">
            <LuMenu />
          </IconButton>
        </DrawerTrigger>

        <DrawerBackdrop />

        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" paddingY={3}>
            <MTC height={6} width={6} />
          </DrawerHeader>

          <DrawerCloseTrigger />

          <DrawerBody padding={0} paddingY={2}>
            <Flex direction="column" gap={1} height="100%">
              <SidebarGroup>
                {primaryTabKeys.map((key) => {
                  const tab = tabs[key];
                  return (
                    <SidebarItem
                      key={key}
                      label={tab.label}
                      href={`/${initials}${tab.path}`}
                      icon={tab.icon}
                      color={tab.color}
                      active={currentTab?.path === tab.path}
                      onClick={() => setMobileOpen(false)}
                    />
                  );
                })}
              </SidebarGroup>

              <SidebarGroup label="Analytics">
                {secondaryTabKeys.map((key) => {
                  const tab = tabs[key];
                  return (
                    <SidebarItem
                      key={key}
                      label={tab.label}
                      href={`/${initials}${tab.path}`}
                      icon={tab.icon}
                      color={tab.color}
                      active={currentTab?.path === tab.path}
                      onClick={() => setMobileOpen(false)}
                    />
                  );
                })}
              </SidebarGroup>

              <SidebarGroup label="Tools">
                {toolsTabKeys.map((key) => {
                  const tab = tabs[key];
                  return (
                    <SidebarItem
                      key={key}
                      label={tab.label}
                      href={`/${initials}${tab.path}`}
                      icon={tab.icon}
                      color={tab.color}
                      active={currentTab?.path === tab.path}
                      onClick={() => setMobileOpen(false)}
                    />
                  );
                })}
              </SidebarGroup>

              <SidebarLicense marginTop="auto" borderTopWidth="1px" />
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>

      <Flex gap={1}>
        {primaryTabKeys.slice(0, 4).map((key) => {
          const tab = tabs[key];
          const Icon = tab.icon;
          const isActive = currentTab?.path === tab.path;

          return (
            <IconButton
              key={key}
              asChild
              aria-label={tab.label}
              variant={isActive ? 'solid' : 'ghost'}
              size="lg"
            >
              <NextLink href={`/${initials}${tab.path}`}>
                <Icon color={isActive ? undefined : tab.color} />
              </NextLink>
            </IconButton>
          );
        })}
      </Flex>
    </Flex>
  );

  const desktopSidebar = (
    <Flex
      as="nav"
      direction="column"
      display={{ base: 'none', md: 'flex' }}
      borderRightWidth="1px"
      width={isCollapsed ? '60px' : '220px'}
      transition="width 0.2s"
      overflow="hidden"
    >
      <NextLink href={`/${initials}`} style={{ textDecoration: 'none' }}>
        <Flex
          alignItems="center"
          gap={2}
          paddingX={3}
          height="37px"
          borderBottomWidth="1px"
        >
          <MTC height={7} width={7} />
          {!isCollapsed && (
            <Text fontSize="sm" fontWeight="bold" whiteSpace="nowrap">
              Wiki
            </Text>
          )}
        </Flex>
      </NextLink>

      <Box
        flex={1}
        overflowY={isCollapsed ? 'hidden' : 'auto'}
        overflowX="hidden"
        paddingBottom={2}
      >
        {navContent}
      </Box>

      {!isCollapsed && <SidebarLicense />}

      <Flex direction="column" gap={0} borderTopWidth="1px" paddingY={1}>
        {process.env.NEXT_PUBLIC_STACKBLITZ && (
          <SidebarButton
            icon={<MdRefresh size={20} />}
            label="Refresh"
            onClick={() => utils.invalidate()}
            active={isOverlayOpen}
            collapsed={isCollapsed}
          />
        )}

        {debugEnabled && (
          <SidebarButton
            icon={<LuBug size={20} />}
            label="Debug"
            onClick={() => toggleOverlay()}
            active={isOverlayOpen}
            collapsed={isCollapsed}
          />
        )}

        <SidebarButton
          icon={
            isCollapsed ? (
              <LuPanelLeftOpen size={20} />
            ) : (
              <LuPanelLeftClose size={20} />
            )
          }
          label="Collapse"
          onClick={toggleCollapsed}
          collapsed={isCollapsed}
        />
      </Flex>
    </Flex>
  );

  return (
    <>
      {desktopSidebar}
      {mobileNav}
    </>
  );
}
