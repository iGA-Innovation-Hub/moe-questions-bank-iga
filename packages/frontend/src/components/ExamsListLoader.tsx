import styled from "styled-components";

const ExamsListLoader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="loader__circle" />
        <div className="loader__circle" />
        <div className="loader__circle" />
        <div className="loader__circle" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .loader__circle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    margin: 0 4px;
    animation: loader_901 1s ease-in-out infinite;
  }

  .loader__circle:nth-of-type(1) {
    background-color: #007aff;
    animation-delay: 0;
  }

  .loader__circle:nth-of-type(2) {
    background-color: #ff2d55;
    animation-delay: 0.25s;
  }

  .loader__circle:nth-of-type(3) {
    background-color: #34c759;
    animation-delay: 0.5s;
  }

  .loader__circle:nth-of-type(4) {
    background-color: rgba(255, 140, 0, 0.9);
    animation-delay: 0.75s;
  }

  @keyframes loader_901 {
    0% {
      transform: scale(1);
    }

    20% {
      transform: scale(1.2);
    }

    40% {
      transform: scale(1);
    }
  }
`;

export default ExamsListLoader;
