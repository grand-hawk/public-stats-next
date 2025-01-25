import { Box, Grid, GridItem, Portal, Tabs } from '@chakra-ui/react';
import React, { useContext } from 'react';

import PlaceSelect from '@/components/navigation/placeSelect';
import { tabs } from '@/components/tabs';
import { TabPanelPortalContext } from '@/hooks/tabPanelPortalContext';

export default function Navigation() {
  const tabPanelRef = useContext(TabPanelPortalContext);

  return (
    <Box
      as="nav"
      borderBottomColor="border.muted"
      borderBottomWidth="1px"
      display="flex"
      justifyContent="center"
      paddingX={{
        base: 2,
        sm: 4,
        md: 8,
      }}
      paddingY={4}
    >
      <Box gap={4} maxWidth="750px" width="100%">
        <Grid alignItems="center" gap={4} templateColumns="repeat(2, 1fr)">
          <GridItem>
            <PlaceSelect noLabel />
          </GridItem>

          <GridItem>
            <Tabs.Root
              defaultValue={Object.keys(tabs)[0]}
              fitted
              lazyMount
              size="sm"
              variant="subtle"
            >
              <Tabs.List>
                {Object.entries(tabs).map(([value, { label }]) => (
                  <Tabs.Trigger key={value} value={value}>
                    {label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {tabPanelRef && (
                <Portal container={tabPanelRef}>
                  {Object.entries(tabs).map(([value, { Component }]) => (
                    <Tabs.Content key={value} value={value}>
                      <Component />
                    </Tabs.Content>
                  ))}
                </Portal>
              )}
            </Tabs.Root>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
