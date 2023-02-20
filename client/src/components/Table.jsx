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
}) => {
  return (
    <table className="table table-striped-columns table-bordered mt-2">
      <thead>
        <tr>
          <th style={{ width: 240 }}>{th1}</th>
          <th>{th2}</th>
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
          : data?.map((item) => (
              <tr key={item._id}>
                <td>{item.reportName}</td>
                <td>{item.inspectionBy}</td>
                <td>{item.inspectionDate}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-3" type="button">
                    <a
                      href={item.link}
                      style={{ textDecoration: "none", color: "whitesmoke" }}
                    >
                      Download
                    </a>
                  </button>
                  <label className="me-3">
                    <input
                      type="file"
                      onChange={(e) => handleFile(item._id, e.target.files[0])}
                      style={{
                        width: 0,
                        height: 0,
                        overflow: "hidden",
                        opacity: 0,
                      }}
                    />
                    <span className="btn btn-warning btn-sm">Upload File</span>
                  </label>
                  {item.approved && (
                    <button
                      className="btn btn-info btn-sm"
                      onClick={(e) => handleButton(item._id, item.emailList)}
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
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  );
};
export default Table;
