import React from 'react';
import styled from 'styled-components';

const Commonbtn = ({ buttonLabel, onButtonClick }) => {
  return (
    <StyledWrapper>
      <button onClick={onButtonClick} className="user-btn btn">
        {buttonLabel}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .btn {
    transition: all 0.3s ease-in-out;
    font-family: "Dosis", sans-serif;
    padding: 10px;
    border-radius: 50px;
    background-image: linear-gradient(135deg, #feb692 0%, #ea5455 100%);
    box-shadow: 0 20px 30px -6px rgba(238, 103, 97, 0.5);
    outline: none;
    cursor: pointer;
    border: none;
    font-size: 16px;
    color: #ffecec;
  }

  .btn:hover {
    transform: translateY(3px);
    box-shadow: none;
  }

  .btn:active {
    opacity: 0.5;
  }
`;

export default Commonbtn;
