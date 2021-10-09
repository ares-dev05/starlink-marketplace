import { Box, Stack, Text } from '@chakra-ui/layout'
import { Flex, FormControl, FormLabel, Image } from '@chakra-ui/react'

import { API_URL } from '../../utils/const'
import { AspectRatio } from '@chakra-ui/react'
import BackToMarketLink from '../../components/BackToMarketLink'

const ProfilePage = ({ profile }) => {
    return (
        <Box align="center" mb="20px">
            <Box maxW={'511px'} align="left">
                <BackToMarketLink />
                <Box textAlign="center">
                    <Text
                        fontSize="44px"
                        fontWeight="700"
                        color="white"
                        mt="41px"
                        mb="10px"
                    >
                        {profile.user_name}
                    </Text>
                </Box>
                <AspectRatio maxW="511px" ratio={511 / 213}>
                    <Flex
                        backgroundImage="/profile-image.png"
                        height="213px"
                        backgroundSize="cover"
                        backgroundPosition="center center"
                        borderTopLeftRadius="20px"
                        borderTopRightRadius="20px"
                        justifyContent="flex-end"
                        p="20px"
                        alignItems="flex-start"
                    ></Flex>
                </AspectRatio>
                <Flex justify="center" mt="-82px" mb="-62px">
                    <Flex
                        justify="center"
                        alignItems="center"
                        bg="linear-gradient(0deg, #010001, #E91085, #FBEAAE)"
                        borderRadius="72px"
                        w="143px"
                        h="143px"
                        zIndex={2}
                    >
                        <Image
                            src="/avatar_large.jpg"
                            ignoreFallback
                            width="132px"
                            height="132px"
                            borderRadius="70px"
                        />
                    </Flex>
                </Flex>
                <Box
                    bg="six"
                    borderRadius="0px 0px 15px 15px"
                    p="32px"
                    mb="40px"
                >
                    <Stack spacing="20px" direction="column" mt="40px">
                        {[
                            'user_name',
                            'website',
                            'twitter',
                            'telegram',
                            'instagram',
                        ].map((field, idx) => (
                            <FormControl key={idx}>
                                <FormLabel fontSize="11px" mt="10px">
                                    {field.substring(0, 1).toUpperCase() +
                                        field.substring(1).replace('_', '')}
                                </FormLabel>
                                <Text color={profile[field] ? 'white' : 'gray'}>
                                    {profile[field] || 'No info'}
                                </Text>
                            </FormControl>
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export async function getServerSideProps(context) {
    const { params } = context
    try {
        const res = await fetch(`${API_URL}/users/v1/${params.userId}`, {
            headers: {
                origin: 'https://market.starltoken.com',
            },
        })
        if (res.status !== 200) {
            const txt = await res.text()
            console.log('res.status ' + res.status + ' ' + txt)
            return {
                redirect: {
                    destination: '/',
                },
            }
        }
        const data = await res.json()
        return {
            props: {
                profile: {
                    ...data,
                    website: data.url,
                },
            },
        }
    } catch (err) {
        console.log(err)
    }
    return {
        redirect: {
            destination: '/',
        },
    }
}

ProfilePage.layout = 'Layout'
export default ProfilePage
