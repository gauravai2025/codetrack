import styled, { createGlobalStyle, keyframes } from "styled-components";

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: sans-serif;
  }
  body {
    --size: min(40vw, 40vh);
    --width: calc(var(--size) / 40);
    --dist: calc(var(--width) * 9.8);
    --count: 64;
    --bg: url("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5eeea355389655.59822ff824b72.gif");
    margin: 0;
    height: 100vh;
    width: 100%;
    background-image: linear-gradient(-45deg, #111, #222);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--width);
  }
`;

// Keyframes for animation
const spin = keyframes`
  from {
    transform: rotateY(0);
  }
  to {
    transform: rotateY(1turn);
  }
`;

// Styled components
const Tube = styled.div`
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${spin} 6s infinite linear;
  width: calc(var(--dist) * 2);
  height: var(--size);
  &:nth-child(1) {
    animation-delay: -7.5s;
  }
  &:nth-child(2) {
    animation-delay: -5s;
  }
  &:nth-child(3) {
    animation-delay: -2.5s;
  }
`;

const Strip = styled.div`
  transform-style: preserve-3d;
  background-color: white;
  height: var(--size);
  width: var(--width);
  position: absolute;
  background-image: var(--bg);
  background-size: calc(var(--width) * var(--count)) auto;
  background-repeat: no-repeat;
  backface-visibility: hidden;
  ${({ index }) => `
    transform: rotateY(calc(1turn * ${index} / var(--count))) translateZ(var(--dist));
    background-position: calc(var(--width) * -${index - 1}) center;
  `}
`;

export { GlobalStyle, Tube, Strip };
