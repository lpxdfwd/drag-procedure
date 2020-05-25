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
  .e_scroll::-webkit-scrollbar-thumb {
    background-color: #C1C1C1;
    border-radius: 4px;
    visibility: hidden;
  }
  .e_scroll:hover::-webkit-scrollbar-thumb {
    background-color: #959595;
    visibility: visible;
  }
  .e_scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  input::-webkit-input-placeholder {
    color: #b1b1b1;
  }
  input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px white inset;
  }
  textarea:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px white inset;
  }
  select:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px white inset;
  }
  #root .ant-btn-primary {
    border-radius: .08rem;
  }
  body .ant-drawer-right.ant-drawer-open.no-mask {
    -webkit-transform: none;
    transform: none;
  }
`;
