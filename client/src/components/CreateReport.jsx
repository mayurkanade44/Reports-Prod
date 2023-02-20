import { useRef, useState } from "react";
import { InputRow, InputSelect, Loading } from ".";
import { useDispatch, useSelector } from "react-redux";
import { addPage, createReport, uploadImage } from "../redux/reportSlice";
import { addAdminValues } from "../redux/adminSlice";

const initialState = {
  pest: "",
  floor: "",
  subFloor: "",
  location: "",
  finding: "",
  suggestion: "",
};

const CreateReport = () => {
  const {
    reportLoading,
    image1,
    image2,
    meetTo,
    meetContact,
    meetEmail,
    shownTo,
    shownContact,
    shownEmail,
    inspectionDate,
    contract,
    reportName,
    details,
    reportType,
    templateType,
  } = useSelector((store) => store.report);
  const { adminLoading, findings, suggestions } = useSelector(
    (store) => store.admin
  );
  const { user } = useSelector((store) => store.user);
  const [lastPage, setLastPage] = useState(false);
  const [formValue, setFormValue] = useState(initialState);
  const [other, setOther] = useState({ find: "", suggest: "" });
  const { pest, floor, subFloor, location, finding, suggestion } = formValue;
  const ref = useRef();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const handleImage1 = (e) => {
    const image = e.target.files[0];

    const form = new FormData();
    form.set("imageCount", "image1");
    form.append("image", image);

    dispatch(uploadImage(form));
  };

  const handleImage2 = (e) => {
    const image = e.target.files[0];

    const form = new FormData();
    form.set("imageCount", "image2");
    form.append("image", image);

    dispatch(uploadImage(form));
  };

  const next = async () => {
    if (reportType === "RIM") formValue.pest = "Rodent";
    if (image1) formValue.image1 = image1;
    if (image2) formValue.image2 = image2;
    if (finding === "Other") {
      formValue.finding = other.find;
      dispatch(addAdminValues({ finding: other.find }));
    }
    if (suggestion === "Other") {
      formValue.suggestion = other.suggest;
      dispatch(addAdminValues({ suggestion: other.suggest }));
    }
    await dispatch(addPage({ formValue }));
    setFormValue(initialState);
    ref.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createReport({
        reportName,
        templateType,
        reportType,
        meetTo,
        meetContact,
        meetEmail,
        shownTo,
        shownContact,
        shownEmail,
        inspectionDate,
        details,
        contract,
      })
    );
  };

  const handleLastPage = () => {
    next();
    setTimeout(() => {
      setLastPage(true);
    }, 500);
  };

  if (adminLoading) return <Loading />;
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
              {finding !== "Other" ? (
                <InputSelect
                  label="Findings:"
                  name="finding"
                  value={finding}
                  data={["Select", ...findings, "Other"]}
                  handleChange={handleChange}
                />
              ) : (
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
              {suggestion !== "Other" ? (
                <InputSelect
                  label="Suggestions:"
                  name="suggestion"
                  value={suggestion}
                  data={["Select", ...suggestions, "Other"]}
                  handleChange={handleChange}
                />
              ) : (
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
                    ref={ref}
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
                  templateType === "Single Picture"
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
                disabled={
                  templateType === "Single Picture"
                    ? image1 === null
                      ? true
                      : false
                    : image2 === null
                    ? true
                    : false
                }
              >
                Add Last Page
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
export default CreateReport;
