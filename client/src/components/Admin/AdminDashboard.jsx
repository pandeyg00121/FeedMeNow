import React from 'react';
import { Box, Grid, HStack, Heading, Stack, Text } from '@chakra-ui/react';
import { RiArrowDownLine, RiArrowUpLine } from 'react-icons/ri';
import { DoughnutChart, LineChart, WeeklyUserChart } from './Chart';
import Sidebar from './Sidebar';
import img from '../../assets/cursor red.png';

// Sample data for the dashboard
const data = {
  restaurants: {
    currentMonthQty: 50,
    lastMonthQty: 40,
  },
  users: { qty: 23, qtyPercentage: 78, profit: true },
  totalIncome: { currentMonthIncome: 5000, lastMonthIncome: 4000 },
  totalOrders: 356,
};

const Databox = ({ title, qty, qtyPercentage, profit }) => (
  <Box
    w={['full', '20%']}
    boxShadow={'-3px 0 12px rgb(255, 199, 0)'}
    p={'8'}
    borderRadius={'lg'}
    bg={profit ? 'green.50' : 'red.50'}
  >
    <Text
      fontWeight={'bold'}
      color={profit ? 'green.600' : 'red.600'}
      fontSize={['md', 'xl']}
    >
      {title}
    </Text>
    <HStack spacing={'6'} alignItems="center">
      <Text
        fontSize={['xl', '2xl']}
        fontWeight={'bold'}
        children={qty}
        color={'black'}
      />
      <HStack>
        <Text
          color={'black'}
          fontSize={['sm', 'md']}
          fontWeight={'bold'}
          children={`${qtyPercentage}%`}
        />
        {profit ? (
          <RiArrowUpLine color="green" />
        ) : (
          <RiArrowDownLine color="red" />
        )}
      </HStack>
    </HStack>
    <Text
      color={'black'}
      opacity={0.6}
      fontSize={['xs', 'sm']}
      children={'Since Last Month'}
    />
  </Box>
);

const AdminDashboard = () => {
  const growthInRestaurants =
    data.restaurants.currentMonthQty - data.restaurants.lastMonthQty;

  const incomeIncrease =
    data.totalIncome.currentMonthIncome - data.totalIncome.lastMonthIncome;

  return (
    <>
      <Grid minH={'100vh'} templateColumns={['1fr', '5fr 1fr']} gap={0}>
        <Box py={'8'} px={['4', '0']} bg="grey.900" borderRadius={'xl'}>
          <Heading
            children="Admin Dashboard"
            ml={['0', '16']}
            mb={'8'}
            textAlign={['center', 'left']}
            textTransform={'uppercase'}
            fontSize={['2xl', '4xl']}
            color="white"
          />
          <Stack
            direction={['column', 'row']}
            minH={'24'}
            justifyContent={'space-evenly'}
            spacing={4}
            px={['4', '0']}
          >
            <Databox
              title="Restaurants"
              qty={data.restaurants.currentMonthQty}
              qtyPercentage={
                (growthInRestaurants / data.restaurants.lastMonthQty) * 100
              }
              profit={growthInRestaurants >= 0}
            />
            <Databox
              title="Users"
              qty={data.users.qty}
              qtyPercentage={data.users.qtyPercentage}
              profit={data.users.profit}
            />
            <Databox
              title="Monthly Income"
              qty={data.totalIncome.currentMonthIncome}
              qtyPercentage={
                (incomeIncrease / data.totalIncome.lastMonthIncome) * 100
              }
              profit={incomeIncrease >= 0}
            />
            <Databox
              title="Total Orders"
              qty={data.totalOrders}
              qtyPercentage={0}
              profit={false}
            />
          </Stack>
          <Box
            mt={['8', '16']}
            mx={['4', '16']}
            boxShadow={'-3px 0 12px rgba(255, 199, 0,0.6)'}
            borderRadius={'xl'}
            padding={'2px'}
            bg="black"
          >
            <Heading
              textAlign={['center', 'left']}
              size={'md'}
              children={'Sales Graph'}
              py={'4'}
              px={'6'}
              fontSize={['lg', '2xl']}
              color="white"
            />
            <LineChart />
          </Box>
          <Box
            mt={['8', '16']}
            mx={['4', '16']}
            bgColor="black"
            borderRadius={'xl'}
            boxShadow={'-3px 0 12px rgba(255, 199, 0,0.6)'}
          >
            <Heading
              textAlign={['center', 'left']}
              size={'md'}
              children={'Weekly User Increase'}
              py={'4'}
              px={'6'}
              fontSize={['lg', '2xl']}
              color="white"
            />
            <WeeklyUserChart />
          </Box>
          <Grid templateColumns={['1fr', '2fr 1fr']} mt={'8'} gap={8}>
            <Box
              p={'20'}
              bgColor="black"
              margin={'50px'}
              mb={'40px'}
              borderRadius={'xl'}
              boxShadow={'-3px 0 12px rgba(255, 199, 0,0.6)'}
              maxHeight={'800px'}
            >
              <Heading
                textAlign={'center'}
                size={'lg'}
                mb={'4'}
                children={'Payment Method'}
                fontSize={['lg', 'xl']}
                color="white"
              />
              <DoughnutChart />
            </Box>
          </Grid>
        </Box>
        <Sidebar />
      </Grid>
    </>
  );
};

export default AdminDashboard;
