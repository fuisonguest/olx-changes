import {
  Heading,
  Avatar,
  Box,
  Image,
  Flex,
  Stack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import CatNavbar from './CatNavbar';
import MyadCards from './MyadCards.js';

export default function Profile() {
  const authname = localStorage.getItem('authname')
  const picture = localStorage.getItem("authpicture");

  return (
    <div><CatNavbar />
    <div className="mt-3 mb-3" py={6}>
      <Flex direction={{ base: 'column', md: 'row' }}>
        <Box
          maxW={'270px'}
          w={'full'}
          className='mx-4 card'
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'2xl'}
          rounded={'md'}
          overflow={'hidden'}>
          <Image
            h={'120px'}
            w={'full'}
            src={
              'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
            }
            objectFit={'cover'}
          />
          <Flex justify={'center'} mt={-12}>
            <Avatar
              size={'xl'}
              src={
               picture
              }
              alt={'Author'}
              css={{
                border: '2px solid white',
              }}
            />
          </Flex>

          <Box p={6}>
            <Stack spacing={0} align={'center'} mb={5}>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                {authname}
              </Heading>
              {/* <Text color={'gray.500'}>Frontend Developer</Text> */}
            </Stack>

            {/* <Stack direction={'row'} justify={'center'} spacing={6}>
              <Stack spacing={0} align={'center'}>
                <Text fontWeight={600}>23k</Text>
                <Text fontSize={'sm'} color={'gray.500'}>
                  Followers
                </Text>
              </Stack>
              <Stack spacing={0} align={'center'}>
                <Text fontWeight={600}>23k</Text>
                <Text fontSize={'sm'} color={'gray.500'}>
                  Followers
                </Text>
              </Stack>
            </Stack> */}
            
            <a href='/editprofile'>
            <Button
              w={'full'}
              mt={8}
              bg={useColorModeValue('#151f21', 'gray.900')}
              color={'white'}
              rounded={'md'}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}>
              Edit Profile
            </Button>
            </a>
          </Box>
        </Box>
        <Box w={'full'}>
          <MyadCards />
        </Box>
      </Flex>
    </div>
    </div>
  );
}