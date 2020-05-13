import {createGlobalStyle} from 'styled-components';

export default createGlobalStyle`
  html, body{
    font-size: ${(100 / 1920 * 100)}vw;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  #root{
    height: 100%;
  }
  li{ list-style: none; }
  ul,li{ margin: 0; padding: 0; }
  a{ text-decoration: none; color: inherit; outline: none; }
  p{ margin: 0; padding: 0; }
  a{ -webkit-tap-highlight-color:rgba(255,0,0,0); }
  button{ outline: none; }
`;
