import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { InputRow, InputSelect, SearchContainer } from "../components";
import { getAdminValues } from "../redux/adminSlice";
import {
  reportHandleChange,
  createReport,
  contractDetails,
  createContract,
} from "../redux/reportSlice";

const NewReport = () => {
  const {
    reportLoading,
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
    contract,
    search,
  } = useSelector((store) => store.report);
  const { templates } = useSelector((store) => store.admin);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [showReport, setShowReport] = useState(false);
  const [newContract, setNewContract] = useState({
    number: "",
    billToName: "",
    billToAddress: "",
    billToEmails: [],
    shipToName: "",
    shipToAddress: "",
    shipToEmails: [],
  });
  const [file, setFile] = useState("");
  const navigate = useNavigate();
  const repoType = [];

  const tempTypes = [
    "Single Picture",
    "Double Picture",
    "Before-After Picture",
  ];

  templates.map(
    (item) =>
      item.reportType &&
      !repoType.includes(item.reportType) &&
      repoType.push(item.reportType)
  );

  useEffect(() => {
    dispatch(getAdminValues());

    if (!contract) {
      setTimeout(() => {
        navigate("/newReport");
        setShowReport(false);
      }, 500);
    }

    // eslint-disable-next-line
  }, [contract]);

  const startReport = () => {
    const name = "reportName";
    const number = contract.number[0].toUpperCase() + contract.number.slice(1);
    const value = `${number.replace(/\//g, "-")} ${reportType}`;
    dispatch(reportHandleChange({ name, value }));
    setTimeout(() => {
      setShowReport(true);
    }, 500);
    navigate("/create");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(contractDetails(search));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(reportHandleChange({ name, value }));
  };

  const handleContract = async () => {
    dispatch(createContract(newContract));
    setShowReport(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    form.set("reportName", reportName);
    form.set("templateType", templateType ? templateType : "Direct");
    form.set("reportType", reportType ? repoType : meetTo);
    form.set("meetTo", meetTo);
    form.set("shownTo", shownTo);
    form.set(
      "contract",
      contract
        ? contract.billToEmails.concat(contract.shipToEmails)
        : "clientproxymail@gmail.com"
    );
    form.set("inspectionDate", inspectionDate);
    form.append("file", file);

    dispatch(createReport(form));
  };

  return (
    <>
      {!showReport ? (
        <div className="row my-3 mx-1 d-flex justify-content-center">
          <div className="col-md-7">
            <SearchContainer
              placeholder="Contract Number"
              name="search"
              value={search}
              loading={reportLoading}
              handleSearch={handleSearch}
              handleChange={(e) =>
                dispatch(
                  reportHandleChange({
                    name: e.target.name,
                    value: e.target.value,
                  })
                )
              }
            />
          </div>
          {contract ? (
            <>
              <div className="col-md-6">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="text-center">Bill To Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Name - {contract.billToName}</td>
                    </tr>
                    <tr>
                      <td>Address - {contract.billToAddress}</td>
                    </tr>
                    <tr>
                      <td>Email - {contract.billToEmails.toString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="text-center">Ship To Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Name - {contract.shipToName}</td>
                    </tr>
                    <tr>
                      <td>Address - {contract.shipToAddress}</td>
                    </tr>
                    <tr>
                      <td>Email - {contract.shipToEmails.toString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-12 d-flex justify-content-center">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowReport(true)}
                >
                  Create New Report
                </button>
              </div>
              <div className="col-md-6 mt-5">
                <h5 className="text-danger text-center">
                  If You Want To Upload Direct Report.
                </h5>
                <form
                  onSubmit={handleSubmit}
                  className="d-flex flex-column justify-content-center align-items-center"
                >
                  <div className="col-md-10">
                    <InputRow
                      label="Report Name:"
                      type="text"
                      name="reportName"
                      value={reportName}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-md-10">
                    <InputRow
                      label="Report Type:"
                      type="text"
                      name="meetTo"
                      value={meetTo}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-md-10">
                    <InputRow
                      label="Inspection By:"
                      type="text"
                      name="shownTo"
                      value={shownTo}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-md-10">
                    <InputRow
                      label="Inspection Date:"
                      type="date"
                      name="inspectionDate"
                      value={inspectionDate}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-md-10 my-3">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                  <div className="col-md-4 text-center">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={
                        !reportName ||
                        !file ||
                        !inspectionDate ||
                        !shownTo ||
                        !meetTo
                          ? true
                          : false
                      }
                    >
                      {reportLoading ? "Uploading" : "Submit Report"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="col-md-6 mt-5 justify-content-center">
                <h6 className="text-danger text-center">
                  If Client Has No Contract Please Provide Below Details.
                </h6>
                <div className="col-md-10">
                  <InputRow
                    label="Client Name:"
                    type="text"
                    name="billToName"
                    value={newContract.billToName}
                    handleChange={(e) =>
                      setNewContract({
                        ...newContract,
                        billToName: e.target.value,
                        number: e.target.value,
                        shipToName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-10">
                  <h5 htmlFor="floatingTextarea d-inline">Client Address:</h5>
                  <textarea
                    className="form-control"
                    placeholder="Please provide full client address"
                    name="billToAddress"
                    value={newContract.billToAddress}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        billToAddress: e.target.value,
                        shipToAddress: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-success mt-2"
                    disabled={
                      !newContract.billToName || !newContract.billToAddress
                        ? true
                        : false
                    }
                    onClick={handleContract}
                  >
                    Create New Report
                  </button>
                </div>
              </div>
              {(user.role === "Admin" || user.role === "Back Office") && (
                <div className="col-md-6 mt-5">
                  <h5 className="text-danger text-center">
                    If You Want To Upload Direct Report.
                  </h5>
                  <form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column justify-content-center align-items-center"
                  >
                    <div className="col-md-10">
                      <InputRow
                        label="Report Name:"
                        type="text"
                        name="reportName"
                        value={reportName}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-10">
                      <InputRow
                        label="Report Type:"
                        type="text"
                        name="meetTo"
                        value={meetTo}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-10">
                      <InputRow
                        label="Inspection By:"
                        type="text"
                        name="shownTo"
                        value={shownTo}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-10">
                      <InputRow
                        label="Inspection Date:"
                        type="date"
                        name="inspectionDate"
                        value={inspectionDate}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-10 my-3">
                      <label htmlFor="" className="me-2">
                        <h5>Report: </h5>
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </div>
                    {/* <div className="col-md-10 mb-3">
                      <label htmlFor="" className="me-2">
                        <h5>Quotation: </h5>
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setQuotation(e.target.files[0])}
                      />
                    </div> */}
                    <div className="col-md-4 text-center">
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={
                          !reportName ||
                          !file ||
                          !inspectionDate ||
                          !shownTo ||
                          !meetTo
                            ? true
                            : false
                        }
                      >
                        {reportLoading ? "Uploading" : "Submit Report"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="container mt-3">
          <div className="col-md-6">
            <InputSelect
              label="Template Type:"
              name="templateType"
              value={templateType}
              data={["Select", ...tempTypes]}
              handleChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <InputSelect
              label="Report Type:"
              name="reportType"
              value={reportType}
              data={["Select", ...repoType]}
              handleChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <InputRow
              label="Inspection Date:"
              type="date"
              name="inspectionDate"
              value={inspectionDate}
              handleChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <InputRow
              label="Meet To:"
              type="text"
              name="meetTo"
              value={meetTo}
              handleChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <InputRow
              label="Meet Contact:"
              type="text"
              name="meetContact"
              value={meetContact}
              handleChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <InputRow
              label="Meet Email:"
              type="email"
              name="meetEmail"
              value={meetEmail}
              handleChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <InputRow
              label="Show To:"
              type="text"
              name="shownTo"
              value={shownTo}
              handleChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <InputRow
              label="Shown Contact:"
              type="text"
              name="shownContact"
              value={shownContact}
              handleChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <InputRow
              label="Shown Email:"
              type="email"
              name="shownEmail"
              value={shownEmail}
              handleChange={handleChange}
            />
          </div>
          <div className="col-md-6 mt-3 d-flex justify-content-center">
            <button
              className="btn btn-primary"
              onClick={startReport}
              disabled={
                !templateType ||
                !reportType ||
                !meetTo ||
                !inspectionDate ||
                !shownTo
                  ? true
                  : false
              }
            >
              Start Report
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default NewReport;
