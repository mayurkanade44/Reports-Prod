import React from "react";

const InputRow = ({
  label,
  type,
  name,
  value,
  placeholder,
  width,
  handleChange,
}) => {
  return (
    <div className="row g-3 align-items-center input-row">
      <div className="col-auto ">
        <label className="col-form-label">
          <h4>{label}</h4>
        </label>
      </div>
      <div className="col">
        <input
          className="form-control"
          required
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={handleChange}
          style={{ width: width }}
        />
      </div>
    </div>
  );
};

export default InputRow;
