import styled from "styled-components";

const ExamSelector = () => {
  return (
    <StyledWrapper>
      <div className="radio-inputs">
        <label className="radio">
          <input type="radio" name="radio" defaultChecked />
          <span className="name">Building</span>
        </label>
        <label className="radio">
          <input type="radio" name="radio" />
          <span className="name">Pending</span>
        </label>
        <label className="radio">
          <input type="radio" name="radio" />
          <span className="name">Approved</span>
        </label>
        <label className="radio">
          <input type="radio" name="radio" />
          <span className="name">Rejected</span>
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #eee;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: 450px;
    font-size: 14px;
  }

  .radio-inputs .radio {
    flex: 1 1 auto;
    text-align: center;
  }

  .radio-inputs .radio input {
    display: none;
  }

  .radio-inputs .radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: 0.5rem 0;
    color: rgba(51, 65, 85, 1);
    transition: all 0.15s ease-in-out;
  }

  .radio-inputs .radio input:checked + .name {
    background-color: #fff;
    font-weight: 600;
  }
`;

export default ExamSelector;
