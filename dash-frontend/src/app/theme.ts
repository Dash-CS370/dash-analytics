import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: '#000', // Set your desired background color here
                color: '#fff',
            },
        },
    },
    components: {
        Textarea: {
            baseStyle: {
                color: '#000', // Set your desired input background color here
            },
        },
    },
});

export default theme;
