const EmailTable = ({data}) => {
  return (
    <table className="table table-striped-columns table-bordered mt-2 emails">
      <thead>
        <tr>
          <th style={{ width: 110 }} className="text-center">
            Date
          </th>
          <th style={{ width: 200 }} className="text-center">
            Report Name
          </th>
          <th className="text-center">Email Ids</th>
          <th style={{ width: 100 }} className="text-center">
            Send By
          </th>
          <th style={{ width: 200 }} className="text-center">
            Download
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.sendDate.split("T")[0]}</td>
            <td>{item.reportName}</td>
            <td className="email">{item.emails}</td>
            <td>{item.sendBy}</td>
            <td>
              <button className="btn btn-primary btn-sm me-3" type="button">
                <a
                  href={item.report}
                  style={{
                    textDecoration: "none",
                    color: "whitesmoke",
                  }}
                >
                  Report
                </a>
              </button>
              {item.quotation && (
                <button className="btn btn-success btn-sm" type="button">
                  <a
                    href={item.quotation}
                    style={{
                      textDecoration: "none",
                      color: "whitesmoke",
                    }}
                  >
                    Quotation
                  </a>
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default EmailTable