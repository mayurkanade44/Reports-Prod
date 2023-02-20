import React from "react";

const InputSelect = ({
  label,
  data,
  name,
  value,
  id,
  width,
  w,
  handleChange,
}) => {
  return (
    <div className="row mt-2 input-row ">
      <div className="col-5">
        <h4>{label}</h4>
      </div>
      <div className="col-7">
        <select
          className="form-select form-select-sm"
          aria-label="Default select example"
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          required
        >
          {data.map((data) => {
            return (
              <option value={data} key={data}>
                {data}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default InputSelect;
