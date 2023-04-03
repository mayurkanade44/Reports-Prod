import check from "../images/check1.png";

const Table = ({
  user,
  th1,
  th2,
  th3,
  th4,
  data,
  handleButton,
  handleFile,
  handleGenerate,
  handleDownload,
}) => {
  return (
    <table className="table table-striped-columns table-bordered mt-2">
      <thead>
        <tr>
          <th style={{ width: 350 }} className="text-center">
            {th1}
          </th>
          <th className="text-center">{th2}</th>
          <th>{th3}</th>
          {th4 && <th className="text-center">{th4}</th>}
        </tr>
      </thead>
      <tbody>
        {user === "Admin" || user === "Back Office"
          ? data?.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.role}</td>
                <td>
                  {item.role !== "Admin" && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleButton(item._id)}
                    >
                      Remove User
                    </button>
                  )}
                </td>
              </tr>
            ))
          : data?.map((item, index) => (
              <tr key={item._id || index}>
                <td>{item.reportName}</td>
                <td>{item.inspectionBy}</td>
                <td className="text-center">
                  {item.inspectionDate.split("T")[0]}
                </td>
                <td>
                  {item.link ? (
                    <>
                      <button
                        className="btn btn-primary btn-sm me-3"
                        type="button"
                        onClick={() =>
                          handleDownload({
                            link: item.link,
                            quotation: item.quotation,
                          })
                        }
                      >
                        Download
                      </button>
                      <label className="me-3">
                        <input
                          type="file"
                          className="upload"
                          onChange={(e) =>
                            handleFile(
                              item._id,
                              e.target.files[0],
                              "Upload Report"
                            )
                          }
                        />
                        <span className="btn btn-warning btn-sm">
                          Upload Report
                        </span>
                      </label>
                      <label className="me-3">
                        <input
                          type="file"
                          className="upload"
                          onChange={(e) =>
                            handleFile(
                              item._id,
                              e.target.files[0],
                              "Upload Quotation"
                            )
                          }
                        />
                        <span className="btn btn-secondary btn-sm">
                          Upload Quotation
                        </span>
                      </label>
                      {item.approved && (
                        <button
                          className="btn btn-info btn-sm"
                          onClick={(e) =>
                            handleButton(item._id, item.emailList)
                          }
                        >
                          Send Email
                          {item.email && (
                            <img
                              src={check}
                              alt="check"
                              style={{
                                width: 15,
                                paddingBottom: 4,
                                paddingLeft: 2,
                              }}
                            />
                          )}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleGenerate(item._id)}
                    >
                      Generate Report
                    </button>
                  )}
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  );
};
export default Table;
