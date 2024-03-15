import {
  Box,
  Grid,
  HStack,
  Heading,
  Progress,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import cursor from '../../../assets/cursor red.png';
import { RiArrowDownLine, RiArrowUpLine } from 'react-icons/ri';
import { DoughnutChart, LineChart } from './Chart';
import Sidebar from './Sidebar';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';

const Databox = ({ title, qty, qtyPercentage, profit }) => (
  <Box
    w={['full', '20%']}
    boxShadow={'-1px 0 10px rgba(255,0,0,0.5)'}
    p={'8'}
    borderRadius={'lg'}
  >
    <Text
      fontWeight={'bold'}
      color={profit ? 'green.500' : 'red.500'}
      children={title}
    />
    <HStack spacing={'6'}>
      <Text fontSize={'2xl'} fontWeight={'bold'} children={qty} />
      <HStack>
        <Text children={`${qtyPercentage}%`} />
        {profit ? (
          <RiArrowUpLine color="green" />
        ) : (
          <RiArrowDownLine color="red" />
        )}
      </HStack>
    </HStack>
    <Text opacity={0.6} children={'Since Last Month'} />
  </Box>
);

const Bar = ({ title, value, profit }) => (
  <Box py="4" px={['0', '20']}>
    <Heading size={'sm'} children={title} mb="2" />
    <HStack w={'full'} alignItems={'center'}>
      <Text children={profit ? '0%' : `-${value}%`} />
      <Progress w={'full'} value={profit ? value : 0} colorScheme="purple" />
      <Text children={`${value > 100 ? value : 100}%`} />
    </HStack>
  </Box>
);

const RestaurantDashboard = () => {
  return (
    <>
      <Grid
        css={{
          cursor: `url(${cursor}),default`,
        }}
        minH={'100vh'}
        templateColumns={['1fr', '5fr 1fr']}
      >
        <Box boxShadow={'border-box'} py={'8'} px={['4', '0']}>
          {/* <Text textAlign={"center"} opacity={0.5} children={`Last Change was on ${String(new Date()).split('G')[0]}`}/> */}
          <Heading
            children="Dashboard"
            ml={['0', '16']}
            mb={'16'}
            textAlign={['center', 'left']}
            textTransform={'uppercase'}
          />
          <Stack
            direction={['column', 'row']}
            minH={'24'}
            justifyContent={'space-evenly'}
          >
            <Databox title="Views" qty={123} qtyPercentage={30} profit={true} />
            <Databox title="Users" qty={23} qtyPercentage={78} profit={true} />
            <Databox
              title="Subscription"
              qty={12}
              qtyPercentage={20}
              profit={true}
            />
          </Stack>
          <Box
            m={['0', '16']}
            borderRadius={'lg'}
            p={['0', '16']}
            mt={['4', '16']}
            boxShadow={'-2px 0 10px rgba(255,0,0,0.5)'}
            maxH={'500px'}
            maxW={'900px'}
          >
            <Heading
              textAlign={['center', 'left']}
              size={'md'}
              children="Sales Graph"
              pt={['8', '0']}
              ml={['0', '16']}
            />
            <LineChart />
          </Box>
          <Grid templateColumns={['1fr', '2fr 1fr']}>
            <Box
              p={['0', '16']}
              borderRadius={'lg'}
              boxShadow={'-2px 0 10px rgba(255,0,0,0.5)'}
              maxH={'500px'}
              maxW={'900px'}
              py={'4'}
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
              ml={['0', '16']}
            >
              <Heading
                textAlign={'center'}
                size={'lg'}
                mb={'4'}
                children="Preferences"
              />
              <DoughnutChart />
            </Box>
          </Grid>
        </Box>
        <Sidebar />
      </Grid>
      <Footer />
    </>
  );
};

export default RestaurantDashboard;
