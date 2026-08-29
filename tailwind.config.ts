import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
		extend: {
			/*
			    Sem este bloco, `font-mono` e `font-sans` do Tailwind usavam o stack PADRÃO
			    da lib e ignoravam --font-mono / --font-ui inteiramente. Como praticamente
			    todo texto de código do site usa a classe `font-mono` (e não a variável),
			    o resultado era Consolas no Windows num portfólio com estética de IDE.
			    Uma linha aqui conserta os ~20 pontos de uso de uma vez.
			*/
			fontFamily: {
				sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
				mono: ['var(--font-jetbrains-mono)', ...defaultTheme.fontFamily.mono],
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					blue: 'var(--ide-accent-blue)',
					purple: 'var(--ide-accent-purple)',
					green: 'var(--ide-accent-green)',
					yellow: 'var(--ide-accent-yellow)',
					red: 'var(--ide-accent-red)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				sm: 'calc(var(--radius) - 6px)',
				md: 'calc(var(--radius) - 4px)',
				lg: 'var(--radius)',
				xl: '0.875rem',
				'2xl': '1.25rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
			},
			boxShadow: {
				'glass-sm': '0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
				'glass-md': '0 12px 36px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
				'glass-lg': '0 24px 60px rgba(0, 0, 0, 0.10), 0 4px 16px rgba(0, 0, 0, 0.05)',
			},
			backdropBlur: {
				xs: '2px',
				'2xl': '40px',
				'3xl': '64px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
