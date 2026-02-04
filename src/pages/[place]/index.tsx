import {
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Icon,
  Separator,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { TbChevronRight } from 'react-icons/tb';

import Layout from '@/components/layout/layout';
import { tabs } from '@/components/layout/navigation/tabs';
import TitledCard from '@/components/wiki/titledCard';
import { usePlace } from '@/hooks/usePlace';
import { formatTitle } from '@/utils/formatTitle';

export default function Place() {
  const place = usePlace();
  const router = useRouter();

  if (!place) return null;

  return (
    <>
      <Head>
        <title>{formatTitle(null, place.initials)}</title>
      </Head>

      <Layout overwriteTabLabel="">
        <Flex
          flexDirection="column"
          gap={8}
          marginX="auto"
          maxWidth="6xl"
          paddingY={8}
        >
          <VStack alignItems="start" gap={1}>
            <Heading size="xl">Welcome to {place.placeName} statistics</Heading>
            <Text color="fg.muted" fontSize="md">
              The official site for vehicle analysis, shell performance, and
              historical game metrics.
            </Text>
          </VStack>

          <Separator />

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {Object.values(tabs).map((item) => {
              const IconComponent = item.icon;

              return (
                <TitledCard
                  key={item.label}
                  cursor="pointer"
                  height="100%"
                  innerPadding={6}
                  title={item.label}
                  transition="all 0.2s"
                  _hover={{
                    borderColor: item.color,
                    backgroundColor: 'bg.muted',
                  }}
                  onClick={() => router.push(`/${place.initials}${item.path}`)}
                >
                  <VStack alignItems="start" gap={6} height="100%">
                    <Flex alignItems="center" gap={4}>
                      <IconComponent boxSize={10} color={item.color} />
                      <Text fontSize="md">{item.description}</Text>
                    </Flex>

                    <Flex alignItems="center" gap={1} marginTop="auto">
                      <Text
                        color={item.color}
                        fontSize="sm"
                        fontWeight="bold"
                        textTransform="uppercase"
                      >
                        View {item.label}
                      </Text>

                      <Icon as={TbChevronRight} color={item.color} />
                    </Flex>
                  </VStack>
                </TitledCard>
              );
            })}
          </SimpleGrid>
        </Flex>
      </Layout>
    </>
  );
}
