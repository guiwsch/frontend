import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    line-height: 1.2;
    color: ${props => props.theme.colors.primary};
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
  }

  button {
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.3s ease;
  }

  input, textarea, select {
    font-family: 'Inter', sans-serif;
    outline: none;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    padding: 12px;
    font-size: 14px;
    transition: all 0.3s ease;

    &:focus {
      border-color: ${props => props.theme.colors.accent};
    }
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.lightGray};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

export default GlobalStyles;
