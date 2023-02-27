import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { InputRow, InputSelect } from ".";
import { addAdminValues } from "../redux/adminSlice";
import { addPage } from "../redux/reportSlice";

const initialState = {
  pest: "Rodent",
  floor: "",
  subFloor: "",
  location: "",
  finding: "",
  suggestion: "",
};

const RIM = ({
  handleSubmit,
  reportType,
  findings,
  suggestions,
  handleImage1,
  handleImage2,
  templateType,
  image1,
  image2,
  reportLoading,
  setLastPage,
  lastPage,
  reportName,
  details,
  user,
}) => {
  const [other, setOther] = useState({ find: "", suggest: "" });

  const ref = useRef();
  const ref1 = useRef();
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState(initialState);
  const { pest, floor, subFloor, location, finding, suggestion } = formValue;

  const next = async () => {
    if (image1) formValue.image1 = image1;
    if (templateType !== "Single Picture") {
      if (image2) {
        formValue.image2 = image2;
      } else {
        formValue.image2 =
          "https://res.cloudinary.com/epcorn/image/upload/v1674627399/signature/No_Image_Available_ronw0k.jpg";
      }
    }
    if (finding === "Other") {
      formValue.finding = other.find;
      dispatch(addAdminValues({ finding: other.find }));
    }
    if (suggestion === "Other") {
      formValue.suggestion = other.suggest;
      dispatch(addAdminValues({ suggestion: other.suggest }));
    }

    if (ref) ref.current.value = "";
    if (ref1.current) ref1.current.value = "";

    await dispatch(addPage({ formValue }));
    setFormValue(initialState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const handleLastPage = () => {
    if (image1) next();
    setTimeout(() => {
      setLastPage(true);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container row my-3">
        <h5 className="text-center">
          {!lastPage ? "New Report" : "Report Summary"}
        </h5>
        {!lastPage ? (
          <>
            {reportType !== "RIM" && (
              <div className="col-md-6">
                <InputRow
                  label="Pest:"
                  type="text"
                  name="pest"
                  value={pest}
                  handleChange={handleChange}
                />
              </div>
            )}
            <div className="col-md-6">
              <InputRow
                label="Floor:"
                type="text"
                name="floor"
                value={floor}
                handleChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <InputRow
                label="Sub Floor:"
                type="text"
                name="subFloor"
                value={subFloor}
                handleChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <InputRow
                label="Location:"
                type="text"
                name="location"
                value={location}
                handleChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <InputSelect
                label="Findings:"
                name="finding"
                value={finding}
                data={["Select", ...findings, "Other"]}
                handleChange={handleChange}
              />
              {finding === "Other" && (
                <InputRow
                  label="Finding"
                  type="text"
                  name="otherFinding"
                  value={other.find}
                  handleChange={(e) =>
                    setOther({ ...other, find: e.target.value })
                  }
                />
              )}
            </div>
            <div className="col-md-6">
              <InputSelect
                label="Suggestions:"
                name="suggestion"
                value={suggestion}
                data={["Select", ...suggestions, "Other"]}
                handleChange={handleChange}
              />
              {suggestion === "Other" && (
                <InputRow
                  label="Suggestions"
                  type="text"
                  name="otherFinding"
                  value={other.suggest}
                  handleChange={(e) =>
                    setOther({ ...other, suggest: e.target.value })
                  }
                />
              )}
            </div>
            <div className="col-md-6 mt-3 mb-2 d-flex">
              <h4 className="img me-1">
                {templateType === "Before-After Picture" ? "Before" : "Image1"}
              </h4>
              <input
                type="file"
                accept="image/*"
                ref={ref}
                onChange={handleImage1}
              />
            </div>
            <div className="col-md-6 my-2 d-flex">
              {templateType !== "Single Picture" && (
                <>
                  <h4 className="img me-1">
                    {templateType === "Before-After Picture"
                      ? "After"
                      : "Image2"}
                  </h4>
                  <input
                    type="file"
                    accept="image/*"
                    ref={ref1}
                    onChange={handleImage2}
                  />
                </>
              )}
            </div>
            <div className="col-2 mt-4">
              <button
                type="button"
                className="btn btn-primary"
                disabled={
                  templateType === "Single Picture" ||
                  templateType === "Before-After Picture"
                    ? image1 === null
                      ? true
                      : false
                    : image2 === null
                    ? true
                    : false
                }
                onClick={next}
              >
                Next
              </button>
            </div>
            <div className="col-8 mt-4 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleLastPage}
              >
                Finish
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="col-md-6 my-3">
              <h4>Report Name - {reportName}</h4>
              <h4>Report Pages - {details.length + 2}</h4>
              <h4>Report By - {user.name}</h4>
            </div>
            <div className="col-md-6 d-flex justify-content-center mt-5">
              <button
                className="btn btn-success mt"
                type="submit"
                disabled={reportLoading || details.length === 0 ? true : false}
              >
                {reportLoading ? "Generating Report..." : "Generate Report"}
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};
export default RIM;
