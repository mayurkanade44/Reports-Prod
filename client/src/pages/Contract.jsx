import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SearchContainer } from "../components";
import {
  contractDetails,
  directUpload,
  reportHandleChange,
} from "../redux/reportSlice";

const Contract = () => {
  const { search, reportLoading, contract } = useSelector(
    (store) => store.report
  );
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(contractDetails(search));
  };

  const navigateCreate = () => {
    navigate("/create");
  };

  const handleDirect = () => {
    dispatch(directUpload());
    navigate("/create");
  };

  return (
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
      {contract && (
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
            <button className="btn btn-primary" onClick={navigateCreate}>
              Create New Report
            </button>
            {user.role === "Admin" && (
              <button className="btn btn-info ms-3" onClick={handleDirect}>
                Direct Upload
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default Contract;
