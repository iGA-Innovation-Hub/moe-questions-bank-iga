import styled from "styled-components";

const ExamSelector = ({ filterValue, setFilterValue, getExams, userRole }) => {
  const handleChange = (value:any) => {
    setFilterValue(value);
    setTimeout(() => {
      getExams(value);
    }, 200);
  };


  return (
    <StyledWrapper>
      <div className="radio-inputs">
        {userRole === "User" && (
          <label className="radio">
            <input
              type="radio"
              name="radio"
              value="building"
              checked={filterValue === "building"}
              onChange={() => handleChange("building")}
            />
            <span className="name" style={{ color: "#007aff" }}>
              Building
            </span>
          </label>
        )}
        <label className="radio">
          <input
            type="radio"
            name="radio"
            value="pending"
            checked={filterValue === "pending"}
            onChange={() => handleChange("pending")}
          />
          <span className="name" style={{ color: "rgba(255, 140, 0, 0.9)" }}>
            Pending
          </span>
        </label>
        <label className="radio">
          <input
            type="radio"
            name="radio"
            value="approved"
            checked={filterValue === "approved"}
            onChange={() => handleChange("approved")}
          />
          <span className="name" style={{ color: "#34c759" }}>
            Approved
          </span>
        </label>
        <label className="radio">
          <input
            type="radio"
            name="radio"
            value="disapproved"
            checked={filterValue === "disapproved"}
            onChange={() => handleChange("disapproved")}
          />
          <span className="name" style={{ color: "#ff2d55" }}>
            Rejected
          </span>
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .radio-inputs {
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #eee;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: 700px;
    font-size: 16px;
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
    transition: all 0.15s ease-in-out;
  }

  .radio-inputs .radio input:checked + .name {
    background-color: #fff;
    font-weight: 600;
  }
`;

export default ExamSelector;
