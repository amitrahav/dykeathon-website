import { useForm } from '@formiz/core'
import { Box, Stack, AspectRatio } from '@chakra-ui/react'
import React from 'react'

export default function DotsStepper(props) {
  const form = useForm({ subscribe: 'form' })
  const spacing = 4

  return (
    <Stack
      direction='row'
      display='flex'
      alignItems='center'
      justifyContent='center'
      spacing={spacing}
      {...props}
    >
      {form.steps?.map((step) => {
        const inactiveProps = !step.isVisited
          ? {
              bg: 'gray.100',
              color: 'gray.400'
            }
          : {}

        const visitedProps: any =
          step.isVisited && !step.isCurrent
            ? {
                bg: 'white',
                color: 'brand.500',
                borderColor: 'currentColor',
                as: 'button',
                type: 'button',
                onClick: () => form.goToStep(step.name),
                _hover: {
                  bg: 'brand.500',
                  color: 'white',
                  borderColor: 'brand.500'
                },
                _focus: {
                  boxShadow: 'outline'
                }
              }
            : {}

        const currentProps = step.isCurrent
          ? {
              zIndex: 1,
              bg: 'brand.500',
              color: 'white'
            }
          : {}

        return (
          <AspectRatio key={step.name} w='6' ratio={1}>
            <Box
              zIndex={0}
              borderRadius='full'
              border='2px solid transparent'
              fontWeight={step.isCurrent || step.isVisited ? 'bold' : null}
              outline='none'
              fontSize='xs'
              overflow='visible'
              transition='0.2s'
              _after={
                step.index !== 0
                  ? {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      mt: '-1px',
                      mr: '2px',
                      top: '50%',
                      right: '100%',
                      bg:
                        step.isVisited || step.isCurrent
                          ? 'brand.500'
                          : 'gray.100',
                      h: '2px',
                      w: spacing
                    }
                  : null
              }
              {...inactiveProps}
              {...visitedProps}
              {...currentProps}
            >
              {step.index + 1}
            </Box>
          </AspectRatio>
        )
      })}
    </Stack>
  )
}
