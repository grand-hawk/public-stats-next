import { Box, Grid, GridItem, Portal, Tabs } from '@chakra-ui/react';
import React, { useContext } from 'react';

import PlaceSelect from '@/components/placeSelect';
import { KdrTab } from '@/components/tabs/kdr';
import { TabPanelPortalContext } from '@/hooks/tabPanelPortalContext';

const tabs: Record<string, { label: string; render: () => React.JSX.Element }> =
  {
    kdr: {
      label: 'K/D Ratio',
      render: KdrTab,
    },
  };

export default function Navigation() {
  const tabPanelRef = useContext(TabPanelPortalContext);

  return (
    <Box
      as="nav"
      borderBottomColor="border.muted"
      borderBottomWidth="1px"
      display="flex"
      justifyContent="center"
      paddingX={8}
      paddingY={4}
    >
      <Box gap={4} maxWidth="650px" width="100%">
        <Grid alignItems="center" gap={4} templateColumns="repeat(2, 1fr)">
          <GridItem>
            <PlaceSelect noLabel />
          </GridItem>

          <GridItem>
            <Tabs.Root
              defaultValue={Object.keys(tabs)[0]}
              fitted
              size="sm"
              variant="enclosed"
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
                  {Object.entries(tabs).map(([value, { render }]) => (
                    <Tabs.Content key={value} value={value}>
                      {render()}
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
