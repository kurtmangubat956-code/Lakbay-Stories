import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                serif: ['Fraunces', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                cream: {
                    50: '#FDFBF6',
                    100: '#FAF6EE',
                    200: '#F1EADB',
                    300: '#E3D8C2',
                },
                forest: {
                    50: '#EFF5F0',
                    100: '#DAE8DD',
                    200: '#B4D0BB',
                    400: '#5E9273',
                    500: '#3F7355',
                    600: '#2F5C43',
                    700: '#244936',
                    800: '#1B3829',
                    900: '#12261C',
                },
                ink: '#1C211E',
                clay: '#A8552F',
            },
        },
    },

    plugins: [forms],
};
